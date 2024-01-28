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

            // 구독 정보가 존재하면 구독 취소
            if (subscriptionsResult.Items && subscriptionsResult.Items.length > 0) {
                const subscription = subscriptionsResult.Items[0] as Subscription;

                const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
                    TableName: "subscription",
                    Key: {
                        SubscriptionId: subscription.SubscriptionId,
                    },
                    UpdateExpression: "SET isDeleted = :isDeleted, deletedAt = :deletedAt",
                    ExpressionAttributeValues: {
                        ":isDeleted": true,
                        ":deletedAt": new Date().toISOString(),
                    },
                    ReturnValues: "ALL_NEW", // Return the updated item
                };

                await dynamoDb.update(updateParams).promise();

                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({message: "Unsubscribe successfully"}),
                };
            } else {
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({message: "Not found subscribe"}),
                };
            }
        } else {
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