import {
  aws_dynamodb,
  aws_cognito as cognito, // Added Cognito
  aws_apigateway as apigateway, // Added for Authorizer types
  CfnOutput,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  Cors,
  LambdaRestApi,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class MyApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /** IDENTITY: Project 4 - Cognito **/
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      selfSignUpEnabled: true, // Allow users to sign themselves up
      userVerification: { emailStyle: cognito.VerificationEmailStyle.CODE },
      signInAliases: { email: true },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient('MyUserPoolClient');

    // Create the "Bouncer" for the API
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'MyAuthorizer', {
      cognitoUserPools: [userPool],
    });

    /** DATABASE: Project 3 **/
    const visitorTable = new aws_dynamodb.Table(this, 'VisitorTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    /** BACKEND: Project 2 Logic **/
    const helloLambda = new NodejsFunction(this, 'HelloHandler', {
      entry: 'lambda/hello.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: visitorTable.tableName,
      },
    });

    visitorTable.grantReadWriteData(helloLambda);

    const api = new LambdaRestApi(this, 'MyEndpoint', {
      handler: helloLambda,
      proxy: false, // Turn off proxy to apply Authorizer to specific methods
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    // Protect your API route with the Cognito Authorizer
    const helloResource = api.root.addResource('hello');
    helloResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(helloLambda),
      {
        authorizer: authorizer,
        authorizationType: AuthorizationType.COGNITO,
      },
    );

    const storageBucket = new Bucket(this, 'UserStorageBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [HttpMethods.PUT, HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    const uploadLambda = new NodejsFunction(this, 'UploadHandler', {
      entry: 'lambda/upload.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        STORAGE_BUCKET: storageBucket.bucketName,
      },
    });

    storageBucket.grantPut(uploadLambda);

    const uploadResource = api.root.addResource('get-upload-url');
    uploadResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(uploadLambda),
      {
        authorizer: authorizer,
        authorizationType: AuthorizationType.COGNITO,
      },
    );

    /** FRONTEND: Project 1 Logic **/
    const siteBucket = new Bucket(this, 'SiteBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
    });

    new BucketDeployment(this, 'DeployWebsite', {
      sources: [
        Source.asset('../frontend/dist'),
        Source.jsonData('config.json', {
          apiUrl: api.url,
          userPoolId: userPool.userPoolId, // Needed for frontend login
          userPoolClientId: userPoolClient.userPoolClientId, // Needed for frontend login
          region: this.region,
        }),
      ],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    /** OUTPUTS **/
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'ApiURL', { value: api.url });
    new CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
