Here is the updated Handover Summary. Since we have not yet started the VPC deployment, this summary reflects our transition point from a serverless application into custom networking.
1. Current Status: Ready for Project 6
We have fully completed the "Serverless" phase (Projects 1–5). Our application is live with a functional frontend, secure backend, and private file storage. We are now standing at the "Front Door" of AWS Networking.
2. Target VPC Architecture (Proposed for Project 6)
We are moving away from the "Default AWS VPC" to build a custom, isolated environment.
VPC Name: MyCustomVPC
CIDR Block: 10.0.0.0/16 (65,536 total IP addresses).
Availability Zones (AZs): 2 (For redundancy across physical data centers).
Subnet Strategy:
Public Subnets: For internet-facing resources (Route: 0.0.0.0/0 -> Internet Gateway).
Private Subnets: For protected resources like databases. We will use Isolated Subnets (PRIVATE_ISOLATED) to keep the project 100% Free Tier by avoiding NAT Gateway costs.
3. Completed Components (Projects 1–5)
Frontend: React (Vite) + AWS Amplify, hosted on S3 and CloudFront.
Identity: AWS Cognito with a custom "Bouncer" (Authorizer) for API security.
API: API Gateway with a RESTful structure (/hello, /files, /get-upload-url).
Compute: Multiple Lambda functions (Node.js 20.x).
Storage: S3 with private user-level isolation.
Database: DynamoDB (NoSQL) for the visitor counter.
4. Technical Achievements
Secure Multi-File Upload: Implemented Pre-signed URLs to allow direct, secure browser-to-S3 uploads, bypassing Lambda limits.
Full CRUD on Files: Integrated List, Upload, and Delete capabilities with per-user security.
Consolidated Backend: All CDK logic is unified in a /backend directory for easier management.
5. What's Next: The Project 6 Roadmap
The Build: Define the VPC construct in CDK.
The Learning: Understand the difference between Security Groups (Firewalls) and Subnets (Networks).
The Future (Project 7): Once the VPC is active, we will launch an EC2 Instance inside a private subnet to learn server management