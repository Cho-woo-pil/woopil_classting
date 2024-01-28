import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });

import { handler } from './postNews';
import AWSMock from 'aws-sdk-mock';
import jsonwebtoken from 'jsonwebtoken';


jest.mock('jsonwebtoken');
describe('postNews', () => {

    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
            callback(null, 'successfully put item');
        });

        AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: any, callback: any) => {
            // Assuming that there is only one subscription for simplicity
            callback(null, { Items: [{ email: 'test@example.com' }] });
        });
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });

    it('should register news successfully', async () => {

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            'cognito:groups': ['admin'],
            username: 'testUser'
        }));
        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
            body: JSON.stringify({
                schoolId: 'your_school_id_here',
                topic: 'Test Topic',
                content: 'Test Content',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('news registered successfully');
    });

});