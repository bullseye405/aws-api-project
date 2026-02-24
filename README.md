1. Here is the "behind the scenes" of what MyApiStack is doing when you run cdk deploy:
2. Code Packaging: CDK finds your lambda/hello.ts file, bundles it (converts TypeScript to JavaScript), and uploads it to an S3 "staging" bucket.
3. Lambda Creation: It tells AWS to create a Lambda function using that uploaded code.
API Gateway Provisioning: It creates a REST API (the "Front Door").
4. The "Handshake" (Integration): It creates a Proxy Integration. This tells the API Gateway: "Whenever someone hits this URL, trigger my specific Lambda function and pass the request data to it." AWS API Gateway Integration
5. Permission Update: CDK automatically adds a Resource-Based Policy to your Lambda. This gives the API Gateway explicit permission to "invoke" (run) your Lambda. Without this, the API would return a 500 Internal Server Error.
6. The Endpoint: Finally, it displays the Invoke URL. This is the unique, public address where your API lives.

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
