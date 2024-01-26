import {handler} from './signup';

function generateRandomUsername() {
    const randomSuffix = Math.random().toString(36).substring(7);
    return `testUser_${randomSuffix}`;
}
describe('Signup Lambda Function', () => {
    it('Successful Signup', async () => {
        const event = {
            body: JSON.stringify({
                username:  generateRandomUsername(),
                email: 'test@example.com',
                password: 'TestPassword123',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('User registered successfully');
    });

    it('Invalid Password Length', async () => {
        const event = {
            body: JSON.stringify({
                username: 'testUser',
                email: 'test@example.com',
                password: 'short',
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(response.body).toContain('Password must be at least 8 characters long');
    });

    it('User Already Exists', async () => {
        const event = {
            body: JSON.stringify({
                username: 'existingUser', // 이미 존재하는 사용자 이름
                email: 'test@example.com',
                password: 'TestPassword123',
            }),
        };


        const response = await handler(event);
        expect(response.statusCode).toBe(500);
        expect(response.body).toContain('Error registering user');

    });

});
