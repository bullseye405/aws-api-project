# Project 9: The "Set It and Forget It" Automation (User Data & Launch Templates)

## Overview

In Project 8, you did everything manually: SSHing into the instance, installing Nginx, and writing the dashboard script. In Project 9, you move to User Data automation so your server becomes self-configuring. If the instance is terminated and a new one launches, it should automatically boot as a fully functional web server.

## Core Objective

Use a User Data script in CDK to automate the manual setup steps from Project 8. This script runs as the root user during the first second the EC2 instance boots.

## What You'll Build

- Infrastructure as Code (Level 2): Modify your `ec2.Instance` construct in CDK to include an `addUserData()` block.
- Bootstrap script: Write a script inside CDK that:
  - updates the operating system,
  - installs Nginx,
  - uses environment variables for the DynamoDB table name and S3 bucket name,
  - generates the Cloud Architect Dashboard automatically.
- The "Cattle, Not Pets" test: Terminate your EC2 instance from the AWS Console, then verify a new instance starts up already hosting your custom dashboard.

## Key Technical Concepts

- **User Data:** A script that runs only once during the first boot.
- **Immutability:** Instead of fixing servers by hand, you replace them with perfect copies.
- **Cloud-Init:** The background process that executes User Data on boot.
- **Dynamic Variables in CDK:** Pass `visitorTable.tableName` into the EC2 User Data script so it always references the correct table name.

## Why This Matters

This is the foundation of auto-scaling and high availability. In production, you never SSH into 100 servers to install software; you write automation once and thousands of servers configure themselves.