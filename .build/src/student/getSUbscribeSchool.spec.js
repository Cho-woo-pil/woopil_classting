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
const getSubscribeSchool_1 = require("./getSubscribeSchool"); // 실제 핸들러 파일의 경로로 바꾸세요
const aws_sdk_mock_1 = __importDefault(require("aws-sdk-mock"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('YourHandler', () => {
    beforeEach(() => {
        aws_sdk_mock_1.default.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [{ schoolId: 'school1', name: 'School 1', region: 'Region 1' }, /* Add more schools as needed */] });
        });
        aws_sdk_mock_1.default.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
            // Mocking the response for DynamoDB scan
            callback(null, { Items: [{ schoolId: 'school1', username: 'test' }, /* Add more schools as needed */] });
        });
    });
    it('should return school list for a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockToken = 'mocked_token';
        jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementation((token) => ({
            given_name: 'testUser'
        }));
        const event = {
            headers: {
                Authorization: mockToken,
            },
        };
        const result = yield (0, getSubscribeSchool_1.handler)(event);
        expect(result.statusCode).toBe(200);
    }));
});
