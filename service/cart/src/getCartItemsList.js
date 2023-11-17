import AWS from 'aws-sdk';
import pkg from 'pg';

const { Client } = pkg;
const lambda = new AWS.Lambda();
const response = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }
};

export const handler = async () => {
    const userId = '39bd7798-a059-473d-8f06-01e98c91b307';
    console.log(`User: ${userId}`);

    const client = new Client({
        statement_timeout: 5000,
        ssl: {
            rejectUnauthorized: false
        }
    });
    let carts;

    try {
        await client.connect();

        const result = await client.query(
            `SELECT c.id, c.user_id, c.created_at, c.updated_at, c.status, ci.product_id, ci.count
               FROM cart_items ci
               JOIN carts c ON ci.cart_id = c.id
               WHERE c.user_id = $1`,
            [userId]
        );

        const productIdList = result.rows.map(result => result.product_id);

        await Promise.all(productIdList.map((productId) => {
            const getProductsByIdParams = {
                FunctionName: 'product-service-dev-getProductsById',
                Payload: JSON.stringify({
                    pathParameters: { productId }
                })
            };

            return lambda.invoke(getProductsByIdParams).promise();
        })).then((values) => {
            const products = values.map(resp=> JSON.parse(JSON.parse(resp.Payload).body));
            carts = result.rows.map((cart) => {
                return {
                    ...cart,
                    product: products.find(({id}) => id === cart.product_id)
                }
            });
        });
    } catch (error) {
        console.error('Error executing query', error);
        return {
            ...response,
            statusCode: 500,
            body: JSON.stringify({error: 'Internal Server Error'}),
        };
    } finally {
        await client.end();
    }
    console.log(carts);
    return {
        ...response,
        statusCode: 200,
        body: JSON.stringify(carts),
    };
};