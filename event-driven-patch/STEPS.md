# Add the S3 trigger to terraform-event-driven-project

1. Copy `s3_trigger.tf` into the repo, next to `main.tf`.
2. Replace the repo's `index.py` with the one here.
3. Run:
   ```
   terraform init
   terraform plan     # expect: 2 to add, 1 to change (the Lambda code)
   terraform apply
   ```
4. Test it:
   ```
   echo "hello" > test.txt
   aws s3 cp test.txt s3://<project_name>-payloads-2026/test.txt
   aws dynamodb scan --table-name <project_name>-records
   ```
   After a few seconds the table should show a row with `bucket`, `key` and `source` = `s3`.
5. Only when step 4 works, tell me and I will add "S3 upload" to the project on the site and to the resume line.
6. Run `terraform destroy` when you are done testing to avoid charges.
