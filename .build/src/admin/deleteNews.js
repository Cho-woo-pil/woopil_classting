"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.handler = void 0;
const AWS = __importStar(require("aws-sdk"));
const jsonwebtoken_1 = require("jsonwebtoken");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = event.headers.Authorization;
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized" }),
            };
        }
        const decodedToken = (0, jsonwebtoken_1.decode)(token);
        const groups = decodedToken['cognito:groups'];
        if (groups && groups.includes('admin')) {
            const body = JSON.parse(event.body);
            const { newsId } = body;
            if (!newsId) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "newsId is required fields" }),
                };
            }
            // 기존 뉴스 가져오기
            const getParams = {
                TableName: "news",
                Key: { newsId },
            };
            const existingNews = yield dynamoDb.get(getParams).promise();
            // 뉴스가 존재하는지 확인
            if (!existingNews.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "News not found" }),
                };
            }
            // 뉴스 삭제
            const deletedParam = {
                TableName: "news",
                Key: { newsId },
                UpdateExpression: "SET #isDeleted = :isDeleted, #deletedAt = :deletedAt",
                ExpressionAttributeNames: {
                    "#isDeleted": "isDeleted",
                    "#deletedAt": "deletedAt",
                },
                ExpressionAttributeValues: {
                    ":isDeleted": true,
                    ":deletedAt": new Date().toISOString(),
                },
                ReturnValues: "ALL_NEW",
            };
            yield dynamoDb.update(deletedParam).promise();
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "news delete successfully" }),
            };
        }
        else {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "This user is not admin" }),
            };
        }
    }
    catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
});
exports.handler = handler;