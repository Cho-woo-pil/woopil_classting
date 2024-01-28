import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });
import AWSMock from 'aws-sdk-mock';
import { handler } from './subscribe'; // 실제 핸들러 파일의 경로로 바꾸세요
import jsonwebtoken from "jsonwebtoken";

jest.mock('jsonwebtoken');

function generateRandomSchoolId() {
    const randomSuffix = Math.random().toString(36).substring(7);
    return `school_${randomSuffix}`;
}
describe('YourHandler', () => {
    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: any, callback: any) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [] });
        });

        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
            // Mocking the response for DynamoDB put
            callback(null, {});
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
            body: JSON.stringify({ schoolId: generateRandomSchoolId() }),
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.message).toBe('subscribe successfully');
    });

    it('should handle already subscribed user', async () => {
        const mockToken = 'mocked_token';

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token) => ({
            given_name: 'testUser',
        }));

        // Mocking DynamoDB scan to return existing subscription
        AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: any, callback: any) => {
            callback(null, { Items: [{ schoolId: 'school1', username: 'testUser' }] });
        });

        const event = {
            headers: {
                Authorization: mockToken,
            },
            body: JSON.stringify({ schoolId: 'school1' }),
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.message).toBe('already Subscribe');
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
