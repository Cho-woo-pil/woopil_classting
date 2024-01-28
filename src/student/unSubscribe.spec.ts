import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });
import AWSMock from 'aws-sdk-mock';
import { handler } from './unSubscribe'; // 실제 핸들러 파일의 경로로 바꾸세요
import jsonwebtoken from "jsonwebtoken";

jest.mock('jsonwebtoken');
describe('YourHandler', () => {
    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: any, callback: any) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [] });
        });

        AWSMock.mock('DynamoDB.DocumentClient', 'update', (params: any, callback: any) => {
            // Mocking the response for successful update
            callback(null, 'successfully updated item');
        });
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });

    it('should subscribe a user to a school', async () => {
        const mockToken = 'mocked_token';

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token) => ({
            given_name: 'testUser',
        }));

        const event = {
            headers: {
                Authorization: mockToken,
            },
            body: JSON.stringify({ schoolId: 'school_jsbshg' }),
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.message).toBe('Unsubscribe successfully');
    });


    it('should handle missing schoolId in request body', async () => {
        const mockToken = 'mocked_token';

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token) => ({
            given_name: 'testUser',
        }));

        const event = {
            headers: {
                Authorization: mockToken,
            },
            body: JSON.stringify({}),
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(400);
        const body = JSON.parse(result.body);
        expect(body.error).toBe('schoolId is required fields');
    });

});
