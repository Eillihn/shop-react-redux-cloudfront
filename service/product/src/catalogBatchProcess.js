import AWS from 'aws-sdk';

const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const lambda = new AWS.Lambda();

export const handler = async (event) => {
  console.log(event.Records);

  for (const record of event.Records) {
    if (record.eventSource === 'aws:sqs' && record.body) {
      record.body.id = { S: record.body.id };
      try {
        console.log(`record.body: ${record.body}`);
        const createProductParams = {
          FunctionName: 'product-service-dev-createProduct',
          InvocationType: 'Event',
          Payload: JSON.stringify(record)
        };

        await lambda.invoke(createProductParams, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.log(data);
          }
        });
        await sqs
          .deleteMessage({
            QueueUrl: process.env.CATALOG_ITEMS_QUEUE_URL,
            ReceiptHandle: record.receiptHandle,
          })
          .promise();
        console.log('Message deleted.');

        const snsParams = {
          Message: `Products have been created: ${record.body}`,
          TopicArn: process.env.SNS_TOPIC_ARN,
        };

        await sns.publish(snsParams).promise();
        console.log('Email sent.');
      } catch (e) {
        console.log(e);
      }
    }
  }

  return { ...response, statusCode: 200, body: 'Products created successfully' };
};
