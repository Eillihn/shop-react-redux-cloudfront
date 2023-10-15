const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
};
exports.handler = async (event) => {
  console.log(`Product id from parameters: ${event.pathParameters.productId}`);
  try {
    const productId = parseInt(event.pathParameters.productId, 10);

    const productsParams = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: { ':id': productId }
    };

    const productsData = await dynamodb.query(productsParams).promise();
    const product = productsData.Items[0];

    if (!product) {
      return {
        ...response,
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' })
      };
    }

    const stocksParams = {
      TableName: process.env.STOCKS_TABLE_NAME
    };

    const stocksData = await dynamodb.scan(stocksParams).promise();
    const stocks = stocksData.Items;

    const productWithStock = {
      ...product,
      count: stocks.reduce(
        (total, stock) =>
          stock.product_id === productId ? total + stock.count : total,
        0
      )
    };

    return {
      ...response,
      statusCode: 200,
      body: JSON.stringify(productWithStock)
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
