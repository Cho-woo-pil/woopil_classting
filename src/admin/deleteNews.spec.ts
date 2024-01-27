import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });

import { handler } from './deleteNews';
import AWSMock from 'aws-sdk-mock';
import jsonwebtoken from 'jsonwebtoken';


jest.mock('jsonwebtoken');
describe('deleteNews', () => {

    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: any, callback: any) => {
            // Mocking the response for existing news
            callback(null, { Item: { newsId: 'your_existing_news_id', topic: 'Test Topic', content: 'Test Content' } });
        });

        AWSMock.mock('DynamoDB.DocumentClient', 'delete', (params: any, callback: any) => {
            // Mocking the response for successful update
            callback(null, 'successfully delete item');
        });
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });

    it('should delete news successfully', async () => {


        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            'cognito:groups': ['admin'],
        }));
        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
            body: JSON.stringify({
                newsId: 'e1fad0b20e2',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('news delete successfully');
    });
    it('should handle non-existing news during update', async () => {
        // Simulate non-existing news
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: any, callback: any) => {
            // Mocking the response for non-existing news
            callback(null, {});
        });
        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            'cognito:groups': ['admin'],
        }));

        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
            body: JSON.stringify({
                newsId: 'non_existing_newsId',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).error).toBe('News not found');
    });
});