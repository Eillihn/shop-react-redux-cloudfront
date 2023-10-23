import AWS from 'aws-sdk';

const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};
export const handler = async (event) => {
  const { name } = event.queryStringParameters;
  console.log(name);

  try {
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const params = {
      Bucket: process.env.IMPORT_BUCKET_NAME,
      Key: `${process.env.IMPORT_CATALOG_NAME}/${name}`,
      ContentType: 'text/csv',
    };
    console.log(params);
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return {
      ...response,
      statusCode: 200,
      body: JSON.stringify(signedUrl),
    };
  } catch (error) {
    console.log(error);
    return {
      ...response,
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
