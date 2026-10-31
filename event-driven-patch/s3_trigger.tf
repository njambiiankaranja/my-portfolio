# 7. Let S3 send "object created" events to the SQS queue

# The queue must allow S3 to send messages to it, but only from this bucket.
resource "aws_sqs_queue_policy" "allow_s3" {
  queue_url = aws_sqs_queue.event_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowS3ToSendMessages"
      Effect    = "Allow"
      Principal = { Service = "s3.amazonaws.com" }
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.event_queue.arn
      Condition = {
        ArnEquals = { "aws:SourceArn" = aws_s3_bucket.payload_bucket.arn }
      }
    }]
  })
}

# Every new object in the bucket now puts a message on the queue.
resource "aws_s3_bucket_notification" "payload_uploaded" {
  bucket = aws_s3_bucket.payload_bucket.id

  queue {
    queue_arn = aws_sqs_queue.event_queue.arn
    events    = ["s3:ObjectCreated:*"]
  }

  # The queue policy has to exist first, or S3 rejects the notification.
  depends_on = [aws_sqs_queue_policy.allow_s3]
}
