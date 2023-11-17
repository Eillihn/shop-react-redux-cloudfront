import AWS from 'aws-sdk';
import csv from 'csv-parser';
const s3 = new AWS.S3({ httpOptions: { timeout: 3000 } });
const sqs = new AWS.SQS();

export const handler = async (event) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;

  if (Key.indexOf(process.env.IMPORT_CATALOG_NAME) === -1) {
    return;
  }
  console.log(`${Bucket} ${Key}`);

  try {
    const params = {
      Bucket,
      Key,
    };
    const records = [];

    await s3
      .copyObject({
        Bucket: Bucket,
        CopySource: `${Bucket}/${Key}`,
        Key: Key.replace(process.env.IMPORT_CATALOG_NAME, process.env.PARSED_CATALOG_NAME),
      })
      .promise();
    console.log('File copied.');

    await new Promise(function (resolve, reject) {
      s3.getObject(params)
        .createReadStream()
        .pipe(csv({
          separator: ';'
        }))
        .on('data', (data) => records.push(data))
        .on('error', (error) => reject(error))
        .on('end', () => resolve());
    });

    await s3
      .deleteObject({
        Bucket,
        Key,
      })
      .promise();
    console.log('File deleted.');

    const queueUrl = process.env.CATALOG_ITEMS_QUEUE_URL;
    console.log(`Queue Url: ${queueUrl}`);

    for (const record of records) {
    console.log(`JSON.stringify(record): ${JSON.stringify(record)}`);
      await sqs
        .sendMessage({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(record),
        })
        .promise();
    }
  } catch (e) {
    console.log(e);
  }
};
