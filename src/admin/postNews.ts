import * as AWS from "aws-sdk";
import { decode } from 'jsonwebtoken';
import {News, NewsFeed, School, Subscription} from "../entity";


const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
    try {
        const token = event.headers.Authorization;

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized" }),
            };
        }
        const decodedToken: any = decode(token);
        const groups = decodedToken['cognito:groups'];
        if (groups && groups.includes('admin')) {
            const body = JSON.parse(event.body);

            const {schoolId, topic, content} = body;

            if (!schoolId || !topic || !content) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: "schoolId, topic and content are required fields"}),
                };
            }

            // DynamoDB에서 isDeleted가 false인 Subscription 찾기
            const subscriptionParams: AWS.DynamoDB.DocumentClient.ScanInput = {
                TableName: "subscription",
                FilterExpression: "isDeleted = :isDeleted AND schoolId = :schoolId",
                ExpressionAttributeValues: {
                    ":isDeleted": false,
                    ":schoolId": schoolId
                },
            };
            const subscriptionsResult = await dynamoDb.scan(subscriptionParams).promise();


            const news = new News(schoolId, topic, content);
            const transactItems = [];


            for (const subscription of subscriptionsResult.Items as Subscription[]) {
                const newsFeed = new NewsFeed(news.newsId, subscription.username);

                transactItems.push({
                    Put: {
                        TableName: "newsFeed",
                        Item: newsFeed,
                    },
                });
            }

            const params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
                TransactItems: [
                    {
                        Put: {
                            TableName: "news",
                            Item: news,
                        },
                    },
                    ...transactItems,
                ],
            };

            await dynamoDb.transactWrite(params).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({message: "news registered successfully"}),
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({message: "This user is not admin"}),
            };
        }


    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Internal Server Error"}),
        };
    }
}