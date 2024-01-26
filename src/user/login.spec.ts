import * as handler from './login';

describe('Authentication Handler Tests', () => {
    it('should authenticate user successfully', async () => {
        const event = {
            body: JSON.stringify({
                username: 'testUser1',
                password: 'test1234',
            }),
        };

        const result = await handler.handler(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toContain('Authentication successful');
    });

    it('should handle authentication failure', async () => {
        const event = {
            body: JSON.stringify({
                username: 'invalidUser',
                password: 'invalidPassword',
            }),
        };

        const result = await handler.handler(event);

        expect(result.statusCode).toBe(500);
        expect(result.body).toContain('Error during authentication');
    });
});
