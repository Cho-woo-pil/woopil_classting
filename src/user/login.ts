import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-2_JI67K0OTA',
    ClientId: '369drbea2dsktk1te160clt3f6'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const handler = async (event: any) => {
    try {
        const { username, password } = JSON.parse(event.body);

        const authenticationData = {
            Username: username,
            Password: password
        };

        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        const userData = {
            Username: username,
            Pool: userPool
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        const result = await new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (session) => {
                    resolve(session);
                },
                onFailure: (err) => {
                    console.error('Error during authentication:', err);
                    reject(err);
                },
            });
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Authentication successful', result }),
        };
    } catch (error) {
        console.error('Error during authentication:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Error during authentication' }),
        };
    }
};
