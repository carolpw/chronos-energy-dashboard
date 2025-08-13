import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo = ecr.Repository.fromRepositoryName(this, 'ImportedRepo', 'chronos-backend');

    // 2. Define Lambda function using Docker image from ECR repo
    const lambdaFunction = new lambda.DockerImageFunction(this, 'FastAPILambdaFunction', {
      code: lambda.DockerImageCode.fromEcr(repo, {
        tag: 'latest', // specify your tag here; push the image later with this tag
      }),
      memorySize: 1024, // adjust memory if needed
      timeout: cdk.Duration.seconds(300), // adjust timeout if needed
    });

    // 3. Create API Gateway with Lambda integration
    const api = new apigw.LambdaRestApi(this, 'FastAPILambdaApi', {
      handler: lambdaFunction,
      proxy: true, // all requests proxied to Lambda
    });

    // Output the API URL
    new cdk.CfnOutput(this, 'APIUrl', {
      value: api.url,
    });

    // Output the ECR repo URI for pushing your image later
    new cdk.CfnOutput(this, 'EcrRepoUri', {
      value: repo.repositoryUri,
    });
  }
}
