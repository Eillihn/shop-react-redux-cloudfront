'use strict';
import products from './data.json' assert { type: 'json' };

export const handler = async (event) => {
  const requestedProduct = products.find(
    (product) => parseInt(event.pathParameters.productId, 10) === product.id
  );
  return requestedProduct
    ? {
        statusCode: 200,
        body: JSON.stringify(requestedProduct),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        }
      }
    : {
        statusCode: 404,
        body: 'Product not found',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        }
      };
};
