# Project 8: The Web Server Transformation

## Overview

The goal is to install and configure Nginx (Engine-X), a high-performance HTTP server, to serve content to the internet.

## What You'll Do

1. Install Nginx with the package manager.
2. Start and enable the Nginx service using `systemctl`.
3. Update the `InstanceSG` security group in CDK to allow HTTP traffic on port 80.
4. Replace the default Nginx welcome page with a custom `index.html` file in `/usr/share/nginx/html/`.

## Key Technical Concepts

- Nginx is a service that runs continuously, unlike Lambda functions that run only when invoked.
- Configuration files are stored in `/etc/nginx/`.
- Website files are typically served from `/var/www/html/` or `/usr/share/nginx/html/`.
- Nginx can later act as a reverse proxy for a Node.js application on the same server.

## Why This Matters

This project teaches how to host applications that require a running server, which is essential for full-stack apps when S3 static hosting is not enough.

## Setup

```bash
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

## Optional Generator Script

Use this script on your EC2 instance to generate a simple dashboard page from AWS data.

1. Create the script:

```bash
nano generate_site.sh
```

2. Paste the following into `generate_site.sh`, replacing `YOUR_TABLE_NAME` and `YOUR_BUCKET_NAME`:

```bash
#!/bin/bash

# Get data from AWS services using the permissions set in Project 7
COUNT=$(aws dynamodb scan --table-name YOUR_TABLE_NAME --query "Count" --output text)
FILES=$(aws s3 ls s3://YOUR_BUCKET_NAME --summarize | grep "Total Objects" | awk '{print $3}')

# Build the HTML
cat <<EOF > index.html
<html>
<body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
    <h1>Cloud Architect Dashboard</h1>
    <div style="background: #f4f4f4; border-radius: 10px; display: inline-block; padding: 20px;">
        <h2>Total Visitors: <span style="color: blue;">$COUNT</span></h2>
        <h2>Files in S3: <span style="color: green;">$FILES</span></h2>
    </div>
    <p>Page last updated: $(date)</p>
</body>
</html>
EOF

sudo mv index.html /usr/share/nginx/html/index.html
echo "Dashboard updated!"
```

3. Save and exit the editor, then run:

```bash
chmod +x generate_site.sh
./generate_site.sh
```
