import * as AWS from "aws-sdk";
import { decode } from 'jsonwebtoken';


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

            const {newsId, topic, content} = body;

            if (!newsId || !topic || !content) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: "newsId, topic and content are required fields"}),
                };
            }

            // 기존 뉴스 가져오기
            const getParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
                TableName: "news",
                Key: { newsId },
            };

            const existingNews = await dynamoDb.get(getParams).promise();

            // 뉴스가 존재하는지 확인
            if (!existingNews.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "News not found" }),
                };
            }
            // 뉴스 수정
            const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
                TableName: "news",
                Key: { newsId },
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
            await dynamoDb.update(updateParams).promise();


            return {
                statusCode: 200,
                body: JSON.stringify({message: "news updated successfully"}),
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