import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
};
export const handler = async (event) => {
  try {
    const productsParams = {
      TableName: process.env.PRODUCTS_TABLE_NAME
    };

    const stocksParams = {
      TableName: process.env.STOCKS_TABLE_NAME
    };

    const productsData = await dynamodb.scan(productsParams).promise();
    const products = productsData.Items;

    const stocksData = await dynamodb.scan(stocksParams).promise();
    const stocks = stocksData.Items;

    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(product.id, product);
    });

    stocks.forEach((stock) => {
      const product = productMap.get(stock.product_id);
      if (product) {
        product.count = stock.count;
      }
    });
    const productList = Array.from(productMap.values());

    return {
      ...response,
      statusCode: 200,
      body: JSON.stringify(productList)
    };
  } catch (error) {
    console.log(error);
    return {
      ...response,
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
