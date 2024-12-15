const AWS = require('aws-sdk');

const sns = new AWS.SNS();
let userDonations: Record<string, number> = {}; // In-memory storage

interface APIGatewayEvent {
  body: string;
}

exports.handler = async (event: APIGatewayEvent) => {
  const body = JSON.parse(event.body);
  const { userId, amount } = body;

  if (!userId || typeof amount !== 'number' || amount <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request. userId and a positive amount are required.' })
    };
  }

  // Track user donations
  if (!userDonations[userId]) {
    userDonations[userId] = 0;
  }
  userDonations[userId] += 1;

  if (userDonations[userId] >= 2) {
    const message = `Thank you for your donation! You have made ${userDonations[userId]} donations.`;

    const params = {
      Message: message,
      Subject: 'Thank you for your donation!',
      TopicArn: process.env.TOPIC_ARN
    };

    try {
      await sns.publish(params).promise();
      console.log(`Successfully sent thank you message to user ${userId}`);
    } catch (error) {
      console.error(`Failed to send message to user ${userId}:`, error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Donation recorded.', totalDonations: userDonations[userId] })
  };
};