import * as AWS from "aws-sdk";
import {decode} from 'jsonwebtoken';


const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
    try {
        const token = event.headers.Authorization;
        const decodedToken: any = decode(token);
        const username = decodedToken?.given_name
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({error: "Unauthorized"}),
            };
        }

        if(username){
            const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
                TableName: "school",
            };

            const schoolList = await dynamoDb.scan(scanParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({schoolList}),
            };
        } else{
            return {
                statusCode: 401,
                body: JSON.stringify({error: "Token Error"}),
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