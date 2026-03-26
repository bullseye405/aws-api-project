# Private Lab (Isolated EC2)

You will launch a small virtual server (`t2.micro` or `t3.micro`) into a private isolated subnet.

Because this server is isolated:

- It cannot download updates from the public internet.
- The internet cannot directly access it.

## Challenge

Since it has no public IP, standard SSH from the internet does not work.

## How to Connect (the “magic” way)

To access the instance without a NAT Gateway (which costs money), use one of these options:

1. **Option A (Free & Recommended)**: Temporarily move the instance to a public subnet and assign a public IP for testing. This is the easiest way to practice logging in.
2. **Option B (Pro way)**: Use AWS Systems Manager (SSM) Session Manager. This provides a browser terminal without SSH keys or a public IP.
3. **Step-by-Step Action Plan**: I recommend starting with Option A to confirm your "Public" route works first:
**Modify your CDK Code**: Add an EC2 instance construct to your stack and place it in the PUBLIC subnet first.
**Define a Security Group**: Create a "Firewall" rule that allows SSH (Port 22) from your specific IP address.
**Generate a Key Pair**: You'll need this "digital key" to unlock the server.
**Deploy**: Run cdk deploy.
**The Test**: Try to SSH into the instance using its Public IP. If you can log in and run ping google.com, your Public Subnet and Internet Gateway are working perfectly! 

> Note: In an isolated subnet, SSM requires VPC Endpoints, which may incur small additional costs. 

To connect into ec2
ssh -i project-key.pem ec2-user@<YOUR_PUBLIC_IP>