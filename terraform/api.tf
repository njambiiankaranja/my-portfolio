# ---------- DynamoDB: visitor counter + contact-form rate limit ----------
resource "aws_dynamodb_table" "data" {
  name         = "portfolio-data"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"

  attribute {
    name = "pk"
    type = "S"
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }
}

# ---------- SES: the owner address must click the verification email AWS sends ----------
resource "aws_ses_email_identity" "owner" {
  email = var.owner_email
}

# ---------- Lambda code ----------
data "archive_file" "visit" {
  type        = "zip"
  source_file = "${path.module}/../lambda/visit.py"
  output_path = "${path.module}/build/visit.zip"
}

data "archive_file" "contact" {
  type        = "zip"
  source_file = "${path.module}/../lambda/contact.py"
  output_path = "${path.module}/build/contact.zip"
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# One least-privilege role per function
resource "aws_iam_role" "visit" {
  name               = "portfolio-visit-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role" "contact" {
  name               = "portfolio-contact-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "visit_logs" {
  role       = aws_iam_role.visit.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "contact_logs" {
  role       = aws_iam_role.contact.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "visit_db" {
  name = "update-counter"
  role = aws_iam_role.visit.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:UpdateItem"]
      Resource = aws_dynamodb_table.data.arn
    }]
  })
}

resource "aws_iam_role_policy" "contact_db_ses" {
  name = "rate-limit-and-send"
  role = aws_iam_role.contact.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:UpdateItem"]
        Resource = aws_dynamodb_table.data.arn
      },
      {
        Effect   = "Allow"
        Action   = ["ses:SendEmail"]
        Resource = aws_ses_email_identity.owner.arn
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "visit" {
  name              = "/aws/lambda/portfolio-visit"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "contact" {
  name              = "/aws/lambda/portfolio-contact"
  retention_in_days = 14
}

resource "aws_lambda_function" "visit" {
  function_name    = "portfolio-visit"
  role             = aws_iam_role.visit.arn
  runtime          = "python3.12"
  handler          = "visit.handler"
  filename         = data.archive_file.visit.output_path
  source_code_hash = data.archive_file.visit.output_base64sha256
  timeout          = 5
  memory_size      = 128

  environment {
    variables = { TABLE_NAME = aws_dynamodb_table.data.name }
  }

  depends_on = [aws_cloudwatch_log_group.visit]
}

resource "aws_lambda_function" "contact" {
  function_name    = "portfolio-contact"
  role             = aws_iam_role.contact.arn
  runtime          = "python3.12"
  handler          = "contact.handler"
  filename         = data.archive_file.contact.output_path
  source_code_hash = data.archive_file.contact.output_base64sha256
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      TABLE_NAME   = aws_dynamodb_table.data.name
      OWNER_EMAIL  = var.owner_email
      HOURLY_LIMIT = tostring(var.contact_hourly_limit)
    }
  }

  depends_on = [aws_cloudwatch_log_group.contact]
}

# ---------- API Gateway (HTTP API) ----------
resource "aws_apigatewayv2_api" "api" {
  name          = "portfolio-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = concat(["https://${aws_cloudfront_distribution.site.domain_name}"], var.extra_allowed_origins)
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "visit" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.visit.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "contact" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "visit" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /visit"
  target    = "integrations/${aws_apigatewayv2_integration.visit.id}"
}

resource "aws_apigatewayv2_route" "contact" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.contact.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  # Throttle at the gateway so a flood never reaches Lambda
  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 5
  }
}

resource "aws_lambda_permission" "visit" {
  statement_id  = "AllowApiGatewayVisit"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.visit.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "contact" {
  statement_id  = "AllowApiGatewayContact"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

# ---------- Alarm: tell the owner if the contact function starts failing ----------
resource "aws_sns_topic" "alerts" {
  name = "portfolio-alerts"
}

resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.owner_email
}

resource "aws_cloudwatch_metric_alarm" "contact_errors" {
  alarm_name          = "portfolio-contact-errors"
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  dimensions          = { FunctionName = aws_lambda_function.contact.function_name }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}
