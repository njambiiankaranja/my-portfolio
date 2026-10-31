# Deploy steps

## Part A: Vercel (first, free)
1. Put this folder in a GitHub repo named `portfolio` (or use the Vercel CLI from the `web` folder).
2. In Vercel: Add New > Project > import the repo. Set **Root Directory** to `web`. Framework is detected as Vite. Name the project `ian-karanja` to get `ian-karanja.vercel.app`.
3. Deploy. Without any settings the contact form opens the visitor's email app. After Part B, add the environment variable `VITE_API_BASE` (the `api_url` value) and redeploy, and the form sends real messages.
4. When the AWS stack is live and you want both addresses to work, set `extra_allowed_origins = ["https://ian-karanja.vercel.app"]` in `terraform.tfvars` and apply again.

## Part B: AWS

You need: an AWS account, AWS CLI signed in (`aws configure` or SSO), Terraform 1.10 or newer, and Git.

## 1. State bucket (once)
```
cd bootstrap
terraform init
terraform apply
```
Copy the `state_bucket` value it prints.

## 2. Main stack
1. Open `terraform/versions.tf` and replace `REPLACE_WITH_STATE_BUCKET` with that bucket name.
2. Then:
```
cd ../terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan      # read it before applying
terraform apply
```
3. AWS emails **two** messages to your address: an SES verification link and an SNS subscription confirmation. Click both. The contact form will not send until the SES link is confirmed.

If `apply` fails with "EntityAlreadyExists" for the OIDC provider, set `create_github_oidc_provider = false` in `terraform.tfvars` and apply again.

## 3. GitHub
Create the `portfolio` repo and push this folder. Then in the repo go to Settings > Secrets and variables > Actions > **Variables** and add (values come from `terraform output`):

| Variable | Value |
|---|---|
| `API_BASE` | `api_url` |
| `SITE_BUCKET` | `site_bucket` |
| `CLOUDFRONT_ID` | `cloudfront_distribution_id` |
| `AWS_DEPLOY_ROLE_ARN` | `deploy_role_arn` |

Push to `main` (or run the workflow by hand from the Actions tab). The workflow builds the React site with `npm run build` and uploads `web/dist`. The site is live at `site_url`. Then set `hostedOnAws: true` in `web/src/data.js` so the footer and the portfolio project card tell the truth.

## Clean up
`terraform destroy` in `terraform/` removes everything. Empty the site bucket first if it complains.
