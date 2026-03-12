# Welcome to Your AWS CDK TypeScript Project

This is a serverless API project built with AWS CDK and TypeScript. Deploy scalable, secure APIs with Lambda, API Gateway, and more.

## 📚 Project Documentation

### [Project 3: "The Persistent Greeting"](docs/project3.md)
Build a persistent counter that tracks the number of visitors using DynamoDB and Lambda.
- 🗂️ DynamoDB data storage
- ⚡ Lambda function enhancements
- 🌐 Real-time frontend updates

### [Project 4: "The Members Only Area"](docs/project4.md)
Add user authentication and authorization with AWS Cognito.
- 🔐 Cognito User Pool for user management
- 🚪 Cognito Authorizer for API protection
- 🎨 Authentication UI for login/signup

## 🏗️ How CDK Deployment Works

When you run `cdk deploy`, here's what MyApiStack does:

1. **Code Packaging**: CDK bundles your `lambda/hello.ts` file (converts TypeScript to JavaScript) and uploads it to an S3 staging bucket.

2. **Lambda Creation**: AWS creates a Lambda function using the uploaded code.

3. **API Gateway Provisioning**: Creates a REST API (the "Front Door") for your application.

4. **Integration Setup**: Creates a Proxy Integration that tells API Gateway to trigger your Lambda function whenever someone hits the endpoint and pass the request data to it. [Learn more about API Gateway Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-function-reuse.html)

5. **Permission Configuration**: CDK automatically adds a Resource-Based Policy to your Lambda, giving API Gateway explicit permission to invoke it. Without this, requests would return a 500 Internal Server Error.

6. **Endpoint Display**: Finally, it displays the Invoke URL—the unique, public address where your API lives.

## 🛠️ Useful Commands

```bash
npm run build    # Compile TypeScript to JavaScript
npm run watch    # Watch for changes and auto-compile
npm run test     # Run Jest unit tests
npx cdk deploy   # Deploy this stack to your AWS account/region
npx cdk diff     # Compare deployed stack with current state
npx cdk synth    # Emit the synthesized CloudFormation template
```

## 📋 Project Structure

```
├── bin/                 # Entry point for CDK app
│   └── api-project.ts
├── lib/                 # CDK stack definitions
│   └── api-project-stack.ts
├── lambda/              # Lambda function code
│   └── hello.ts
├── website/             # Static website
│   └── index.html
├── docs/                # Project documentation
│   ├── project3.md
│   └── project4.md
├── test/                # Test files
│   └── api-project.test.ts
├── cdk.json            # CDK configuration
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
└── jest.config.js      # Jest configuration
```

## 📖 Getting Started

The `cdk.json` file tells the CDK Toolkit how to execute your app. For more information, check the [AWS CDK documentation](https://docs.aws.amazon.com/cdk/v2/guide/home.html).
