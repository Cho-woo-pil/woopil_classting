"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = require("./signup");
function generateRandomUsername() {
    const randomSuffix = Math.random().toString(36).substring(7);
    return `testUser_${randomSuffix}`;
}
describe('Signup Lambda Function', () => {
    it('Successful Signup', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            body: JSON.stringify({
                username: generateRandomUsername(),
                email: 'test@example.com',
                password: 'TestPassword123',
            }),
        };
        const response = yield (0, signup_1.handler)(event);
        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('User registered successfully');
    }));
    it('Invalid Password Length', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            body: JSON.stringify({
                username: 'testUser',
                email: 'test@example.com',
                password: 'short',
            }),
        };
        const response = yield (0, signup_1.handler)(event);
        expect(response.statusCode).toBe(400);
        expect(response.body).toContain('Password must be at least 8 characters long');
    }));
    it('User Already Exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            body: JSON.stringify({
                username: 'existingUser', // 이미 존재하는 사용자 이름
                email: 'test@example.com',
                password: 'TestPassword123',
            }),
        };
        const response = yield (0, signup_1.handler)(event);
        expect(response.statusCode).toBe(500);
        expect(response.body).toContain('Error registering user');
    }));
});
