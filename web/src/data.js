// All the words and links on the site live in this one file.
// To add a project or certificate, add one entry to the lists below.

export const profile = {
  name: "Ian Karanja",
  title: "Cloud & Automation Engineer",
  email: "njambiiankaranja@gmail.com",
  // Opens a Gmail compose window (works even when no mail app is set up).
  emailLink: "https://mail.google.com/mail/?view=cm&fs=1&to=njambiiankaranja@gmail.com",
  location: "Nairobi, Kenya",
  github: "https://github.com/njambiiankaranja",
  linkedin: "https://www.linkedin.com/in/ian-karanja-490012365/",
  upwork: "https://www.upwork.com/freelancers/~013b2e42e3703156d8",
  cv: "/Ian-Karanja-CV.pdf",
};

export const site = {
  // Change to true once this site is really served from AWS (S3 + CloudFront).
  // It switches on the AWS wording in the footer and the "This portfolio" project card.
  hostedOnAws: true,
};

const gh = (repo) => `https://github.com/njambiiankaranja/${repo}`;

export const projects = [
  {
    title: "Custom VPC with public and private subnets",
    summary: "A network for AWS workloads, written as Terraform.",
    flow: ["VPC", "Public subnet", "NAT gateway", "Private subnet"],
    points: [
      "Custom VPC (10.0.0.0/16) with one public and one private subnet.",
      "An internet gateway serves the public subnet. A NAT gateway lets the private subnet reach out without being reachable from outside.",
      "Route tables and a security group, all defined in Terraform.",
    ],
    tags: ["Terraform", "VPC", "NAT gateway", "Security groups"],
    repo: gh("aws-vpc-iac"),
  },
  {
    title: "Monitored web server on EC2",
    summary: "A web server in its own VPC that emails me when it is overloaded.",
    flow: ["VPC", "EC2 + Nginx", "CloudWatch alarm", "SNS email"],
    points: [
      "VPC, public subnet, internet gateway and security group, with an Ubuntu EC2 instance that installs Nginx at boot.",
      "A CloudWatch alarm on CPU above 80% sends an email through SNS.",
      "Terraform state is kept in S3, and a GitHub Actions pipeline plans and applies changes.",
    ],
    tags: ["Terraform", "EC2", "Nginx", "CloudWatch", "SNS", "GitHub Actions"],
    repo: gh("terraform-saa-project"),
  },
  {
    title: "Queue-driven processing with Lambda",
    summary: "Messages go onto a queue, and a function saves each one to a database.",
    flow: ["SQS queue", "Lambda (Python)", "DynamoDB"],
    points: [
      "An SQS queue triggers a Python Lambda function, which writes each message to a DynamoDB table.",
      "The function runs under its own IAM role, with write access limited to that one table.",
      "The whole stack is created and removed with terraform apply and destroy.",
    ],
    // When the S3 upload trigger is added to this repo, add: flow "S3 upload" first and a bullet about it.
    tags: ["Terraform", "SQS", "Lambda", "Python", "DynamoDB", "IAM"],
    repo: gh("terraform-event-driven-project"),
  },
  {
    title: "Private media hosting behind CloudFront",
    summary: "Files stay in a private bucket and reach visitors only through a CDN.",
    flow: ["Visitor", "WAF", "CloudFront", "Private S3 bucket"],
    points: [
      "Private S3 bucket with public access blocked. Only CloudFront can read it, through Origin Access Control.",
      "HTTPS is enforced, and a WAF rule blocks any IP address that sends more than 1,000 requests in five minutes.",
      "Everything is provisioned with Terraform.",
    ],
    tags: ["Terraform", "S3", "CloudFront", "WAF", "Origin Access Control"],
    repo: gh("terraform-static-media-project"),
  },
  {
    title: "Static website on S3 with automatic deploys",
    summary: "A wedding landing page published by GitHub Actions on every push.",
    flow: ["git push", "GitHub Actions", "S3 website"],
    points: [
      "S3 static website hosting created with Terraform.",
      "A dedicated IAM user whose policy covers only this one bucket.",
      "A GitHub Actions workflow syncs the site to S3 on every push to main.",
    ],
    note: "The page itself uses an open-source Bootstrap template.",
    tags: ["Terraform", "S3", "IAM", "GitHub Actions"],
    repo: gh("wedding-template"),
  },
  {
    // Shown only when site.hostedOnAws is true.
    title: "This portfolio, run on AWS",
    summary: "The site you are reading, served from AWS and deployed by a pipeline.",
    flow: ["Visitor", "CloudFront", "Private S3 bucket"],
    points: [
      "Static site in a private S3 bucket behind CloudFront with HTTPS.",
      "The contact form and visitor counter run on API Gateway, Lambda, DynamoDB and SES.",
      "Infrastructure in Terraform. GitHub Actions deploys with a short-lived login, so no AWS keys are stored.",
    ],
    tags: ["Terraform", "S3", "CloudFront", "Lambda", "DynamoDB", "SES"],
    repo: gh("portfolio"),
    visible: "awsOnly",
  },
  {
    // Turn on when the Wachno site is running on AWS: set visible to true and fill in the service used.
    title: "Wachno Engineering website",
    summary: "A Next.js and TypeScript website.",
    flow: [],
    points: ["Replace this with what you deployed on AWS for Wachno."],
    tags: ["Next.js", "TypeScript"],
    repo: gh("wachno-engineering"),
    live: "https://wachno-engineering-ecru.vercel.app",
    visible: false,
  },
];

export const skills = [
  {
    group: "Cloud and infrastructure as code",
    items: ["AWS: S3, EC2, IAM, VPC, Lambda, DynamoDB", "Terraform (HCL)", "Infrastructure as code", "GitHub Actions (CI/CD)", "State management"],
  },
  {
    group: "Tools and systems",
    items: ["Linux administration (Ubuntu)", "Terminal operations", "Git", "Microsoft Office Suite"],
  },
  {
    group: "IT support and networks",
    items: ["Hardware and software troubleshooting", "Network fundamentals", "System configuration", "Software installation and package management"],
  },
];

export const services = [
  {
    title: "Network and VPC design",
    text: "Custom VPCs with subnets, route tables and security groups, so each resource is reachable only where it should be.",
  },
  {
    title: "Hosting on AWS",
    text: "Static sites on S3 and CloudFront with HTTPS, or a web app on an EC2 server running Nginx.",
  },
  {
    title: "Infrastructure as code",
    text: "Terraform setups with remote state, so an environment can be rebuilt or removed with one command.",
  },
  {
    title: "CI/CD pipelines",
    text: "GitHub Actions workflows that check and deploy your code on every push, with no manual uploads.",
  },
  {
    title: "Serverless backends",
    text: "Lambda, API Gateway, DynamoDB and SQS for contact forms, small APIs and queued jobs, billed only when used.",
  },
  {
    title: "Monitoring and support",
    text: "CloudWatch alarms, SNS alerts and budget alerts, plus first-line troubleshooting when something stops working.",
  },
];

export const credentials = [
  {
    title: "AWS Cloud Support Associate",
    detail: "Specialization on Coursera, April 2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/certificate/TWO7TPMPC0ZP",
  },
  {
    title: "AWS Serverless Demonstrated",
    detail: "Training badge from AWS, October 2026",
    url: "https://www.credly.com/badges/bdb24ba7-feca-43b2-8132-692811a7e528/linked_in_profile",
  },
  {
    title: "AWS Cloud Quest: Cloud Practitioner",
    detail: "Training badge from AWS, October 2026",
    url: "https://www.credly.com/badges/21e03bb7-c435-4ebe-92bc-5c285aaafb51/linked_in_profile",
  },
  {
    title: "AWS Knowledge: Cloud Essentials",
    detail: "Training badge from AWS, August 2026",
    url: "https://www.credly.com/badges/12e1960c-720c-46e5-a10d-88417ae961d9/linked_in_profile",
  },
  {
    title: "Infrastructure as Code with Terraform",
    detail: "Course certificate on LinkedIn Learning",
    url: "https://www.linkedin.com/learning/certificates/447de2cda3c7292a148d82cd54154526e540bbaeede98b47f0eb3e47872c298a",
  },
];

export const experience = {
  role: "IT Attaché",
  org: "The National Treasury & Economic Planning, State Department for Economic Planning",
  place: "Nairobi, Kenya",
  dates: "May to August 2025",
  points: [
    "Gave first-line technical support to staff.",
    "Installed, configured and tested software applications, with user validation.",
    "Helped troubleshoot printers, photocopiers and network connectivity issues.",
    "Performed routine maintenance of computer systems and peripherals.",
    "Managed data backup procedures with strict file organization and data integrity.",
  ],
};

export const education = {
  degree: "Bachelor of Business Information Technology",
  school: "Mount Kenya University, Nairobi",
  dates: "2022 to 2026",
};
