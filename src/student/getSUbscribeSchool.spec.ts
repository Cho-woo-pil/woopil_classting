import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });
import { handler } from './getSubscribeSchool'; // 실제 핸들러 파일의 경로로 바꾸세요
import AWSMock from 'aws-sdk-mock';
import jsonwebtoken from "jsonwebtoken";


jest.mock('jsonwebtoken');

describe('YourHandler', () => {
    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: any, callback: any) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [{ schoolId: 'school1', name: 'School 1', region: 'Region 1' }, /* Add more schools as needed */] });
        });

        AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: any, callback: any) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [{ schoolId: 'school1', username: 'test' }, /* Add more schools as needed */] });
        });
    });

    it('should return school list for a valid user', async () => {
        const mockToken = 'mocked_token';

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            given_name: 'testUser'
        }));

        const event = {
            headers: {
                Authorization: mockToken,
            },
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
    });

});
