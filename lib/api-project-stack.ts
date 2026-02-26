import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'; // New imports from Project 1
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class MyApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /** BACKEND: Project 2 Logic **/
    const helloLambda = new NodejsFunction(this, 'HelloHandler', {
      entry: 'lambda/hello.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    });

    const api = new LambdaRestApi(this, 'MyEndpoint', {
      handler: helloLambda,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

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
        // 1. Upload your static files (HTML/CSS/JS)
        Source.asset('./website'),

        // 2. Generate and upload the dynamic config file on-the-fly
        Source.jsonData('config.json', {
          apiUrl: api.url,
        }),
      ],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    /** OUTPUTS **/
    new CfnOutput(this, 'ApiURL', { value: api.url });
    new CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
