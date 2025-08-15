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
      code: lambda.DockerImageCode.fromEcr(repo, { tagOrDigest: '20250815v3' }),
      memorySize: 3008, // was 1024 — increase to avoid OOM and speed downloads
      timeout: cdk.Duration.seconds(900), // you already had 900s; keep it
      ephemeralStorageSize: cdk.Size.gibibytes(4), // NEW: raise /tmp from ~512 MB to 4 GB
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
