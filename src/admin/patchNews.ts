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

            const {newsId, topic, content} = body;

            if (!newsId || !topic || !content) {
                return {
                    statusCode: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({error: "newsId, topic and content are required fields"}),
                };
            }

            // 기존 뉴스 가져오기
            const getParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
                TableName: "news",
                Key: { newsId: newsId },
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
            // 뉴스 수정
            const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
                TableName: "news",
                Key: { newsId: newsId  },
                UpdateExpression: "SET #topic = :topic, #content = :content, #updatedAt = :updatedAt",
                ExpressionAttributeNames: {
                    "#topic": "topic",
                    "#content": "content",
                    "#updatedAt": "updatedAt",
                },
                ExpressionAttributeValues: {
                    ":topic": topic || existingNews.Item.topic,
                    ":content": content || existingNews.Item.content,
                    ":updatedAt": new Date().toISOString(),
                },
                ReturnValues: "ALL_NEW",
            };
            console.log('updateParams:', updateParams);
            await dynamoDb.update(updateParams).promise();


            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({message: "news updated successfully"}),
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
        // @ts-ignore
        console.error("Error details:", error.stack);
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