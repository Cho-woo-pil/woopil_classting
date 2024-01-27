import * as AWS from "aws-sdk";
import {decode} from 'jsonwebtoken';


const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
    try {
        const token = event.headers.Authorization;

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({error: "Unauthorized"}),
            };
        }
        const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: "school",
        };

        const schoolList = await dynamoDb.scan(scanParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({schoolList}),
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Internal Server Error"}),
        };
    }
}