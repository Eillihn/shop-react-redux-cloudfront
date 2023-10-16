import AWS from 'aws-sdk';
import products from './products.json' assert { type: 'json' };
import stocks from './stocks.json' assert { type: 'json' };

AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const insertSampleData = async (tableName, data) => {
  for (const item of data) {
    const params = {
      TableName: tableName,
      Item: item
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Inserted item into ${tableName}:`, item);
    } catch (error) {
      console.error('Error inserting sample data:', error);
    }
  }
};

insertSampleData('Products', products)
  .then(() => {
    return insertSampleData('Stocks', stocks);
  })
  .then(() => {
    console.log('Sample data insertion complete.');
  })
  .catch((error) => {
    console.error('Error inserting sample data:', error);
  });
