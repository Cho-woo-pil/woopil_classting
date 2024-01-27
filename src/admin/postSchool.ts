import * as AWS from "aws-sdk";
import { uid } from 'uid';
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

            const {name, region} = body;

            if (!name || !region) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: "name, and region are required fields"}),
                };
            }
            const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
                TableName: "school",
                Item: {
                    schoolId: uid(),
                    name,
                    region,
                    createdAt: new Date().toISOString(),
                    isDeleted: false,
                },
            };
            // DynamoDB에 데이터 삽입
            await dynamoDb.put(params).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({message: "School registered successfully"}),
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