# Ian's Portfolio

My cloud portfolio, a React + Vite site. It can run on Vercel, and the `terraform/` folder runs it on AWS (S3, CloudFront, Lambda) with Terraform.

**Live site:** _add the Vercel or CloudFront address after deploying_

All the site text lives in `web/src/data.js`. To run it locally: `cd web && npm install && npm run dev`.

## Architecture

```
Visitor -> CloudFront (HTTPS) -> private S3 bucket (Origin Access Control)
Browser -> API Gateway (HTTP API) -> Lambda -> DynamoDB   (visitor counter, rate limit)
                                   -> Lambda -> SES       (contact form email)
GitHub Actions --OIDC--> IAM role --> S3 sync + CloudFront invalidation
```

| Part | Folder |
|---|---|
| Website (React + Vite) | `web/` |
| Lambda functions (Python) | `lambda/` |
| Infrastructure as code | `terraform/` |
| One-time state bucket | `bootstrap/` |
| CI/CD | `.github/workflows/` |

## Security choices
- The S3 bucket is fully private; only this CloudFront distribution can read it.
- GitHub deploys with a short-lived OIDC token, so no AWS keys live in GitHub. Only the `main` branch of this repo can assume the role.
- Each Lambda has its own least-privilege IAM role.
- Contact form: honeypot field, gateway throttling, and an hourly cap kept in DynamoDB.
- Alarm emails me if the contact function errors.

## Deploy it yourself
See `DEPLOY.md`.
