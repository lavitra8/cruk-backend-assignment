import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda';

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

    
  }
}
