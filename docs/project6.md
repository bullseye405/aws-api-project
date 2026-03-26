# Project 6: Building a Secure Network (VPC)

Until now, you've used the default VPC provided by AWS. In this project, you will create a custom VPC with public and private subnets to isolate resources and improve security.

## Core Concepts to Learn

- **VPC**: Your private slice of the AWS cloud.
- **Subnets**: Smaller sections of your network.
  - **Public subnet**: Resources here (like a Load Balancer) can talk directly to the internet.
  - **Private subnet**: Resources here (like a Database) are hidden from the internet for security.
- **Internet Gateway (IGW)**: The router that lets your public subnet reach the web.
- **NAT Gateway**: Enables private resources to download updates while preventing inbound internet access.

