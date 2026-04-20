Project 8: The Web Server Transformation

The goal is to install and configure Nginx (Engine-X), a high-performance HTTP server, to serve content to the internet

1. The Core Objectives
    Install Nginx: Use the package manager (dnf or yum) to install the Nginx software on your Amazon Linux instance.
    Process Management: Learn how to start, enable (for auto-restart after reboot), and check the status of the Nginx service using systemctl.
    Security Group Adjustment: Update your InstanceSG in CDK to allow HTTP traffic (Port 80) from the world so you can actually see the website in your browser.
    Custom Content: Replace the default Nginx welcome page with your own custom index.html file located in /usr/share/nginx/html/. 

2. Key Technical Concepts
    Service vs. Script: Unlike a Lambda function that runs only when called, Nginx is a service that stays running 24/7, waiting for requests.
    The Root Directory: You'll get familiar with /etc/nginx/ for configuration and /var/www/html or /usr/share/nginx/html for your website files.
    Nginx as a Reverse Proxy (Future Context): While initially serving a static page, Nginx can eventually "proxy" requests to a Node.js application running on the same server. 

Why This Matters
    This project teaches you how to host "Dynamic" applications that require a running server, preparing you for complex scenarios where S3 hosting isn't enough (e.g., running a full-stack Express or Django app).