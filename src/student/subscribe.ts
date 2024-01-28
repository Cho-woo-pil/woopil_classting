import * as AWS from "aws-sdk";
import {decode} from 'jsonwebtoken';
import {Subscription} from "../entity";


const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
    try {
        const token = event.headers.Authorization;
        const decodedToken: any = decode(token);
        const username = decodedToken?.given_name
        if (!token) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({error: "Unauthorized"}),
            };
        }

        if(username) {
            const body = JSON.parse(event.body);
            const {schoolId} = body;
            if (!schoolId) {
                return {
                    statusCode: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({error: "schoolId is required fields"}),
                };
            }
            const subscriptionParams: AWS.DynamoDB.DocumentClient.QueryInput = {
                TableName: "subscription",
                KeyConditionExpression: "schoolId = :schoolId",
                FilterExpression: "isDeleted = :isDeleted AND username = :username",
                ExpressionAttributeValues: {
                    ":isDeleted": false,
                    ":username": username,
                    ":schoolId": schoolId
                },
            };
            const subscriptionsResult = await dynamoDb.query(subscriptionParams).promise();
            if (subscriptionsResult.Items && subscriptionsResult.Items.length > 0) {
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({message: "already Subscribe"}),
                };
            } else{
                const subscribe = new Subscription(schoolId, username);
                const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
                    TableName: "subscription",
                    Item: subscribe
                };
                await dynamoDb.put(params).promise();

                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({message: "subscribe successfully"}),
                };
            }


        } else{
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({error: "Token Error"}),
            };
        }

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({error: "Internal Server Error"}),
        };
    }
}