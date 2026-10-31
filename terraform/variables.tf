variable "region" {
  type    = string
  default = "us-east-1"
}

variable "owner_email" {
  description = "Where contact-form messages are delivered. SES sends a verification link to this address."
  type        = string
}

variable "github_repo" {
  description = "GitHub repo allowed to deploy the site, as owner/name."
  type        = string
  default     = "njambiiankaranja/portfolio"
}

variable "contact_hourly_limit" {
  description = "Maximum contact-form messages accepted per hour, across all visitors."
  type        = number
  default     = 20
}

variable "create_github_oidc_provider" {
  description = "Set to false if this AWS account already has the GitHub OIDC provider."
  type        = bool
  default     = true
}

variable "extra_allowed_origins" {
  description = "Extra website addresses allowed to call the API, e.g. [\"https://ian-karanja.vercel.app\"] while the Vercel copy is live."
  type        = list(string)
  default     = []
}
