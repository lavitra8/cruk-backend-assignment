import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda';
import * as snsSubscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class RecruitmentNodejsTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create SNS topic
    const donationTopic = new sns.Topic(this, 'DonationTopic', {
      displayName: 'User Donation Thank You Topic'
    });

    // Create Lambda function
    const donationFunction = new lambda.Function(this, 'DonationFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TOPIC_ARN: donationTopic.topicArn
      }
    });

    // Give publish permissions
    donationTopic.grantPublish(donationFunction);

    // Subscribe an email to the topic
    donationTopic.addSubscription(new snsSubscriptions.EmailSubscription('contactsubodhkharat@gmail.com'));

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'donationApi', {
      restApiName: 'Donation Service',
      description: 'This service handles donations.'
    });

    // Create API Gateway Lambda integration
    const donationIntegration = new apigateway.LambdaIntegration(donationFunction);

    // Create API Gateway resource and method
    const donations = api.root.addResource('donations');
    donations.addMethod('POST', donationIntegration);
  }
}
