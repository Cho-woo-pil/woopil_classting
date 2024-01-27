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

        if(username) {
            // DynamoDB에서 isDeleted가 false인 Subscription 찾기
            const subscriptionParams: AWS.DynamoDB.DocumentClient.ScanInput = {
                TableName: "subscription",
                FilterExpression: "isDeleted = :isDeleted AND username = :username",
                ExpressionAttributeValues: {
                    ":isDeleted": false,
                    ":username": username,
                },
            };

            const subscriptionList = await dynamoDb.scan(subscriptionParams).promise();
            if (!subscriptionList.Items) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({schoolList: []}),
                };
            }
            // 각 구독 항목에 대해 학교 정보 조회
            const schoolList: any[] = [];

            for (const subscription of subscriptionList.Items) {
                const schoolId = subscription.schoolId;

                // DynamoDB에서 schoolId로 학교 정보 조회
                const schoolParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
                    TableName: "school",
                    Key: {schoolId: schoolId},
                };

                const schoolInfo = await dynamoDb.get(schoolParams).promise();

                if (schoolInfo.Item) {
                    schoolList.push(schoolInfo.Item);
                }
            }
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