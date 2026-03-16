import * as cdk from 'aws-cdk-lib';
import {
  aws_apigateway as apigateway,
  CfnOutput,
  aws_cloudfront as cloudfront,
  aws_cognito as cognito,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambdaNode,
  aws_cloudfront_origins as origins,
  RemovalPolicy,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
} from 'aws-cdk-lib';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class MyApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- 1. IDENTITY (Cognito) ---
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      selfSignUpEnabled: true,
      userVerification: { emailStyle: cognito.VerificationEmailStyle.CODE },
      signInAliases: { email: true },
      removalPolicy: RemovalPolicy.DESTROY, // Use RETAIN for production
    });

    const userPoolClient = userPool.addClient('MyUserPoolClient');

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'MyAuthorizer',
      {
        cognitoUserPools: [userPool],
      },
    );

    // --- 2. STORAGE (S3 & DynamoDB) ---
    const visitorTable = new dynamodb.Table(this, 'VisitorTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const storageBucket = new s3.Bucket(this, 'UserStorageBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.PUT,
            s3.HttpMethods.GET,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'], // In prod, restrict to CloudFront URL
          allowedHeaders: ['*'],
        },
      ],
    });

    // --- 3. BACKEND (Lambda Functions) ---
    const commonProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      environment: {
        STORAGE_BUCKET: storageBucket.bucketName,
        TABLE_NAME: visitorTable.tableName,
      },
    };

    const helloLambda = new lambdaNode.NodejsFunction(this, 'HelloHandler', {
      entry: 'lambda/hello.ts',
      ...commonProps,
    });

    const uploadLambda = new lambdaNode.NodejsFunction(this, 'UploadHandler', {
      entry: 'lambda/upload.ts',
      ...commonProps,
    });

    const listLambda = new lambdaNode.NodejsFunction(this, 'ListHandler', {
      entry: 'lambda/list.ts',
      ...commonProps,
    });

    const deleteLambda = new lambdaNode.NodejsFunction(this, 'DeleteHandler', {
      entry: 'lambda/delete.ts',
      ...commonProps,
    });

    // --- 4. PERMISSIONS ---
    visitorTable.grantReadWriteData(helloLambda);
    storageBucket.grantPut(uploadLambda);
    storageBucket.grantRead(listLambda);
    storageBucket.grantDelete(deleteLambda);

    // --- 5. API GATEWAY (RESTful Structure) ---
    const api = new apigateway.RestApi(this, 'MyEndpoint', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const authOptions: apigateway.MethodOptions = {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };

    // Route: /hello
    api.root
      .addResource('hello')
      .addMethod(
        'GET',
        new apigateway.LambdaIntegration(helloLambda),
        authOptions,
      );

    // Route: /files (Consolidated for List and Delete)
    const filesResource = api.root.addResource('files');
    filesResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listLambda),
      authOptions,
    );
    filesResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteLambda),
      authOptions,
    );

    // Route: /get-upload-url
    api.root
      .addResource('get-upload-url')
      .addMethod(
        'POST',
        new apigateway.LambdaIntegration(uploadLambda),
        authOptions,
      );

    // --- 6. FRONTEND (S3 & CloudFront) ---
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [
        s3deploy.Source.asset('../frontend/dist'),
        s3deploy.Source.jsonData('config.json', {
          apiUrl: api.url,
          userPoolId: userPool.userPoolId,
          userPoolClientId: userPoolClient.userPoolClientId,
          region: this.region,
        }),
      ],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // --- 7. OUTPUTS ---
    new CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
