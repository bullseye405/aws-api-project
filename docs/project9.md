# Project 9: The "Set It and Forget It" Automation (User Data & Launch Templates)

## Overview

In Project 8, you did everything manually: SSHing into the instance, installing Nginx, and writing the dashboard script. In Project 9, you move to User Data automation so your server becomes self-configuring. If the instance is terminated and a new one launches, it should automatically boot as a fully functional web server.

## Core Objective

Use a User Data script in CDK to automate the manual setup steps from Project 8. This script runs as the root user during the first second the EC2 instance boots.

## What You'll Build

- Infrastructure as Code (Level 2): Modify your `ec2.Instance` construct in CDK to include an `addUserData()` block.
- Bootstrap script: Write a script inside CDK that:
  - Updates the operating system package manager (`dnf` for Amazon Linux 2023).
  - Installs and enables Nginx.
  - Uses CDK string interpolation to inject `visitorTable.tableName` and `vaultBucket.bucketName` directly into the script.
  - Generates the `generate_site.sh` script on the fly.
  - (Extra Credit) Sets up a **Cron Job** to run the dashboard update every 5 minutes.

## Implementation Strategy

### 1. The CDK Construct
In your stack file, you will use the `instance.userData.addCommands()` method.

### 2. IAM Permissions (Crucial Step)
Automation will fail if the instance cannot "talk" to the services. You must explicitly grant the instance role permission to read from your resources:
```typescript
visitorTable.grantReadData(instance);
vaultBucket.grantRead(instance);
```

### 3. The Script Pattern
Using "Here Documents" (`cat <<EOF`) is the best way to create files on the instance via User Data:
```bash
cat <<EOF > /home/ec2-user/generate_site.sh
#!/bin/bash
COUNT=\$(aws dynamodb scan --table-name ${visitorTable.tableName} --query "Count" --output text)
...
EOF
```
*Note: Remember to escape the `$` sign in the script if you are using TypeScript backticks so CDK doesn't try to evaluate it as a local variable.*

- The "Cattle, Not Pets" test: Terminate your EC2 instance from the AWS Console, then verify a new instance starts up already hosting your custom dashboard.

## Key Technical Concepts

- **User Data:** A script that runs only once during the first boot.
- **Immutability:** Instead of fixing servers by hand, you replace them with perfect copies.
- **Cloud-Init:** The background process that executes User Data on boot.
- **Dynamic Variables in CDK:** Pass `visitorTable.tableName` into the EC2 User Data script so it always references the correct table name.

## Troubleshooting & Logs

If your instance starts but the website isn't working, check these three things:
1. **Cloud-Init Logs:** SSH into the instance and run:
   `tail -f /var/log/cloud-init-output.log`
   *This shows you exactly what happened when the User Data script ran.*
2. **Nginx Status:** `sudo systemctl status nginx`
3. **Security Groups:** Ensure Port 80 is open to `0.0.0.0/0`.

### The "UPDATE_ROLLBACK_FAILED" Deadlock
If your stack gets stuck in this state:
1. **Console Fix:** Go to CloudFormation in the AWS Console.
2. **Continue Rollback:** Select the stack -> Stack Actions -> Continue update rollback.
3. **Skip Resources:** Check the boxes to "Skip" any resources that are failing (usually the EC2 instance).
4. **Redeploy:** Once the state is `ROLLBACK_COMPLETE`, run `cdk deploy`.

## Why This Matters

This is the foundation of auto-scaling and high availability. In production, you never SSH into 100 servers to install software; you write automation once and thousands of servers configure themselves.