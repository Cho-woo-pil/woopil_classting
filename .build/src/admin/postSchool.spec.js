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
const postSchool_1 = require("./postSchool");
const aws_sdk_mock_1 = __importDefault(require("aws-sdk-mock"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('postSchool', () => {
    beforeEach(() => {
        aws_sdk_mock_1.default.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, 'successfully put item');
        });
    });
    afterEach(() => {
        aws_sdk_mock_1.default.restore('DynamoDB.DocumentClient');
        jest.restoreAllMocks();
    });
    it('should register school successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementation((token) => ({
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
        const response = yield (0, postSchool_1.handler)(event);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('School registered successfully');
    }));
    it('should handle unauthorized request', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            headers: {},
        };
        const response = yield (0, postSchool_1.handler)(event);
        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).error).toBe('Unauthorized');
    }));
    it('should handle missing name or region', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            headers: {
                Authorization: 'your_mocked_token_here',
            },
            body: JSON.stringify({}),
        };
        const response = yield (0, postSchool_1.handler)(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error).toBe('name, and region are required fields');
    }));
    it('should handle non-admin user', () => __awaiter(void 0, void 0, void 0, function* () {
        //decode해서 나오는 값 지정
        jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementation((token) => ({}));
        const event = {
            headers: {
                Authorization: 'your_mocked_non_admin_token_here',
            },
            body: JSON.stringify({
                name: 'Mock School',
                region: 'Mock Region',
            }),
        };
        const response = yield (0, postSchool_1.handler)(event);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('This user is not admin');
    }));
});
