const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
};
exports.handler = async (event) => {
  console.log(`Product data: ${event.body}`);
  try {
    const { title, description, price, category, author, weight, players } =
      JSON.parse(event.body);

    if (!title || !price) {
      return {
        ...response,
        statusCode: 400,
        body: JSON.stringify({ message: 'Title and price are required.' })
      };
    }

    const productId = generateProductId();

    const productParams = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Item: {
        id: productId,
        title,
        description,
        price,
        category,
        author,
        weight,
        players
      }
    };

    await dynamodb.put(productParams).promise();

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

function generateProductId() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
