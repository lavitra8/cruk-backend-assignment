import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';

export class RecruitmentNodejsTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create SNS topic
    const donationTopic = new sns.Topic(this, 'DonationTopic', {
      displayName: 'User Donation Thank You Topic'
    });
  }
}
