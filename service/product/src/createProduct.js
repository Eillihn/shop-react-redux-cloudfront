import AWS from 'aws-sdk';
import uuid from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
};
export const handler = async (event) => {
  console.log(`Product data: ${event.body}`);

  try {
    const { id = uuid.v4(), title, description, price, category, author, weight, players, count = 0 } =
      JSON.parse(event.body);

    if (!title || !price) {
      return {
        ...response,
        statusCode: 400,
        body: JSON.stringify({ message: 'Title and price are required.' })
      };
    }

    const productParams = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Item: {
        id,
        title,
        description,
        price,
        category,
        author,
        weight,
        players
      }
    };
    const stockParams = {
      TableName: process.env.STOCKS_TABLE_NAME,
      Item: {
        product_id: id,
        count
      }
    };

    await dynamodb.put(productParams).promise();
    await dynamodb.put(stockParams).promise();

    return {
      ...response,
      statusCode: 200,
      body: JSON.stringify({ message: 'Product created successfully.' })
    };
  } catch (error) {
    console.log(error);
    return {
      ...response,
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
