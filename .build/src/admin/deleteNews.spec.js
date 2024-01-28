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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: 'ap-northeast-2' });
const deleteNews_1 = require("./deleteNews");
const aws_sdk_mock_1 = __importDefault(require("aws-sdk-mock"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('deleteNews', () => {
    beforeEach(() => {
        aws_sdk_mock_1.default.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            // Mocking the response for existing news
            callback(null, { Item: { newsId: 'your_existing_news_id', topic: 'Test Topic', content: 'Test Content' } });
        });
        aws_sdk_mock_1.default.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
            // Mocking the response for successful update
            callback(null, 'successfully delete item');
        });
    });
    afterEach(() => {
        aws_sdk_mock_1.default.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });
    it('should delete news successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementation((token) => ({
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
        const response = yield (0, deleteNews_1.handler)(event);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('news delete successfully');
    }));
    it('should handle non-existing news during update', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate non-existing news
        aws_sdk_mock_1.default.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            // Mocking the response for non-existing news
            callback(null, {});
        });
        jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementation((token) => ({
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
        const response = yield (0, deleteNews_1.handler)(event);
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).error).toBe('News not found');
    }));
});
