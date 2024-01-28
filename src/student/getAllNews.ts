import * as AWS from "aws-sdk";
import {decode} from 'jsonwebtoken';
import {News} from "../entity";
import {NewsResponseDto} from "../dto/student/newsResponseDto";


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

        if (username) {
            // DynamoDB에서 username이 맞는 NewsFeed 찾기
            const newsFeedParams: AWS.DynamoDB.DocumentClient.QueryInput = {
                TableName: "newsFeed",
                ProjectionExpression: "newsFeedId, newsId, username, createdAt",
                KeyConditionExpression: "username = :username",
                ExpressionAttributeValues: {
                    ":username": username,
                },
            };
            const newsFeedsResult = await dynamoDb.query(newsFeedParams).promise();

            if (!newsFeedsResult.Items || newsFeedsResult.Items.length === 0) {
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify([]),
                };
            }
            // newsFeedsResult에서 newsID 리스트 얻기
            const newsIDs = newsFeedsResult.Items.map((newsFeed: any) => newsFeed.newsId);
            const newsParams: AWS.DynamoDB.DocumentClient.ScanInput = {
                TableName: "news",
                ProjectionExpression: "newsId, schoolId, topic, content, createdAt",
                FilterExpression: "isDeleted = :isDeleted",
                ExpressionAttributeValues: {
                    ":isDeleted": false,
                },
            };

            const newsList = await dynamoDb.scan(newsParams).promise();


            if (!newsList.Items || newsList.Items.length === 0) {
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify([]),
                };
            }
            const filteredNewsList = newsList.Items.filter((newsItem) => newsIDs.includes(newsItem.newsId));


            filteredNewsList.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            //news 리스트
            const newsListItems = filteredNewsList as News[];
            //news 리스트로 학교정보를 조회후 NewsResponseDto에 맵핑
            const mappedNewsList = await Promise.all(
                newsListItems.map(async (newsItem: News) => {
                    const schoolInfoParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
                        TableName: "school",
                        Key: { schoolId: newsItem.schoolId },
                    };

                    const schoolInfo = await dynamoDb.get(schoolInfoParams).promise();

                    if (schoolInfo.Item) {
                        return new NewsResponseDto(
                            schoolInfo.Item.schoolId,
                            schoolInfo.Item.name,
                            schoolInfo.Item.region,
                            newsItem.newsId,
                            newsItem.topic,
                            newsItem.content,
                            newsItem.createdAt
                        );
                    }
                    return null;
                })
            );
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({mappedNewsList}),
            };
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