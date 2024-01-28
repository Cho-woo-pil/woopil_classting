import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });
import { handler } from './getAllNews';
import AWSMock from 'aws-sdk-mock';
import jsonwebtoken from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('getNewsList', () => {
    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterAll(() => {
        AWSMock.restore();
    });

    it('should return mapped news list', async () => {
        // 기존과는 다르게 awsMock에 Param의 값을 정의해서 해당 Param에 대한 retrun이 다르게 코드 작성해보았습니다.
        // 하지만 여전히 실제 DB를 타는것을 확인
        const mockNewsFeedResult = {
            Items: [
                { newsFeedId: 'feedId1', newsId: 'newsId1', username: 'user1', createdAt: '2024-01-28T03:55:27.664Z' },
            ],
        };
        const mockNewsResult = {
            Items: [
                { newsId: 'newsId1', schoolId: 'schoolId1', topic: 'Topic 1', content: 'Content 1', createdAt: '2024-01-28T03:55:27.664Z' },
            ],
        };

        const mockSchoolInfoResult = {
            Item: { schoolId: 'schoolId1', name: 'School Name', region: 'Region' },
        };

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            given_name: 'test'
        }));


        AWSMock.mock('DynamoDB.DocumentClient', 'query', mockNewsFeedResult);
        AWSMock.mock('DynamoDB.DocumentClient', 'scan', mockNewsResult);
        AWSMock.mock('DynamoDB.DocumentClient', 'get', mockSchoolInfoResult);

        const event = {
            headers: {
                Authorization: 'your-jwt-token',
            },
        };

        // Act
        const result = await handler(event);

        // Example assertion (using Jest):
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeDefined();
        const parsedBody = JSON.parse(result.body);
        expect(parsedBody.mappedNewsList).toBeDefined();
    });
});