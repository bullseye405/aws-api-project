import { Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class MyApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the Lambda function
    const helloLambda = new NodejsFunction(this, 'HelloHandler', {
      entry: 'lambda/hello.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    });

    // Create the API Gateway and connect it to the Lambda
    new LambdaRestApi(this, 'MyEndpoint', {
      handler: helloLambda,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });
  }
}
