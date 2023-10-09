'use strict';
import products from './data.json' assert { type: 'json' };

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
};
