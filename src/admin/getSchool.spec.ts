import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });
import { handler } from './getSchool';
import AWSMock from 'aws-sdk-mock';
import jsonwebtoken from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('getSchoolList', () => {
    beforeEach(() => {
        AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: any, callback: any) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [{ schoolId: 'school1', name: 'School 1', region: 'Region 1' }, /* Add more schools as needed */] });
        });
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });

    it('should get the list of schools successfully', async () => {
        jest.spyOn(jsonwebtoken, 'decode').mockImplementation((token: string) => ({
            'cognito:groups': ['admin'],
        }));

        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);

    });

});
