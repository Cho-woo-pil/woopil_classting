import * as AWS from "aws-sdk";
import { decode } from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
    try {
        const token = event.headers.Authorization;

        if (!token) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: "Unauthorized" }),
            };
        }
        const decodedToken: any = decode(token);
        const groups = decodedToken['cognito:groups'];
        if (groups && groups.includes('admin')) {
            const body = JSON.parse(event.body);

            const {newsId} = body;

            if (!newsId) {
                return {
                    statusCode: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({error: "newsId is required fields"}),
                };
            }

            // 기존 뉴스 가져오기
            const getParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
                TableName: "news",
                Key: { newsId: newsId  },
            };

            const existingNews = await dynamoDb.get(getParams).promise();

            // 뉴스가 존재하는지 확인
            if (!existingNews.Item) {
                return {
                    statusCode: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({ error: "News not found" }),
                };
            }
            // 뉴스 삭제
            const deletedParam: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
                TableName: "news",
                Key: { newsId: newsId  },
                UpdateExpression: "SET #isDeleted = :isDeleted, #deletedAt = :deletedAt",
                ExpressionAttributeNames: {
                    "#isDeleted": "isDeleted",
                    "#deletedAt": "deletedAt",
                },
                ExpressionAttributeValues: {
                    ":isDeleted": true,
                    ":deletedAt": new Date().toISOString(),
                },
                ReturnValues: "ALL_NEW",
            };

            await dynamoDb.update(deletedParam).promise();


            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({message: "news delete successfully"}),
            };
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({message: "This user is not admin"}),
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