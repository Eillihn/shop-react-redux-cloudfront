import pkg from 'pg';

const { Client } = pkg;
const response = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }
};

export const handler = async () => {
    console.log('Start getting orders');
    const client = new Client({
        statement_timeout: 5000,
        ssl: {
            rejectUnauthorized: false
        }
    });
    const orders = [];

    try {
        await client.connect();

        const results = await client.query(`
            SELECT o.id, o.user_id, o.cart_id, o.payment, o.delivery, o.comments, o.status, o.total, ci.product_id, ci.count, u.first_name, u.last_name
               FROM orders o
               JOIN cart_items ci ON o.cart_id = ci.cart_id
               JOIN users u ON o.user_id = u.id
        `);
        results.rows.map(item => ({
            ...item,
            address: {
                ...item.delivery,
                comment: item.comments,
                firstName: item.first_name,
                lastName: item.last_name
            },
            statusHistory: [{
                status: item.status
            }]
        })).forEach((resultItem) => {
            const index = orders.findIndex((order) => order.id === resultItem.id);
            if (index > -1) {
                orders[index].items.push({
                    productId: resultItem.product_id,
                    count: resultItem.count
                });
            } else {
                orders.push({
                    ...resultItem,
                    items: [{
                        productId: resultItem.product_id,
                        count: resultItem.count
                    }]
                });
            }
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
    console.log(orders);
    return {
        ...response,
        statusCode: 200,
        body: JSON.stringify(orders),
    };
};
