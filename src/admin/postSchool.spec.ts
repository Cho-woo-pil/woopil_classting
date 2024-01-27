import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });

import { handler } from './postSchool';
import AWSMock from 'aws-sdk-mock';
import jsonwebtoken from 'jsonwebtoken';


jest.mock('jsonwebtoken');
describe('postSchool', () => {

    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
            callback(null, 'successfully put item');
        });

    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });

    it('should register school successfully', async () => {

        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            'cognito:groups': ['admin'],
        }));
        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
            body: JSON.stringify({
                name: 'Mock School',
                region: 'Mock Region',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('School registered successfully');
    });

    it('should handle unauthorized request', async () => {
        const event = {
            headers: {},
        };
        const response = await handler(event);

        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).error).toBe('Unauthorized');
    });

    it('should handle missing name or region', async () => {
        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
            body: JSON.stringify({

            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error).toBe('name, and region are required fields');
    });

    it('should handle non-admin user', async () => {
        //decode해서 나오는 값 지정
        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
        }));
        const event = {
            headers: {
                Authorization: 'your_mocked_non_admin_token_here',
            },
            body: JSON.stringify({
                name: 'Mock School',
                region: 'Mock Region',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('This user is not admin');
    });
});