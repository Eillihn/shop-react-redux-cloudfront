const USERNAME = 'Eillihn';
const PASSWORD = process.env[USERNAME];

const response = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};

export const handler = async (event, context, callback) => {
  console.log('Basic Authorizer');

  try {
    const authorizationToken = event.authorizationToken;
    const encodedCredentials = authorizationToken.split(' ')[1];
    const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

    if (!authorizationToken) {
      return {
        ...response,
        statusCode: 401,
        body: JSON.stringify({ message: 'Authorization header is not provided' }),
      };
    }

    if (credentials[0] === USERNAME && credentials[1] === PASSWORD) {
      console.log('Credentials are ok');
      console.log(event);
      callback(null, generatePolicy(credentials[0], 'Allow', event.methodArn));
    } else {
      console.log('Credentials are not ok');
      callback('Unauthorized');
    }
  } catch(e) {
    callback(`Unauthorized: ${e.message}`);
  }

};

function generatePolicy(principalId, effect, resource) {
  const authResponse = {
    principalId
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}