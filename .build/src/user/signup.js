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
const AmazonCognitoIdentity = __importStar(require("amazon-cognito-identity-js"));
const poolData = {
    UserPoolId: 'ap-northeast-2_JI67K0OTA',
    ClientId: '369drbea2dsktk1te160clt3f6'
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = JSON.parse(event.body);
        // 클라이언트 측에서 비밀번호 길이를 검증
        if (password.length < 8) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Password must be at least 8 characters long' }),
            };
        }
        const attributeList = [];
        const dataEmail = {
            Name: 'email',
            Value: email,
        };
        const dataGivenName = {
            Name: 'given_name',
            Value: username, // 사용자의 실제 이름 또는 원하는 값을 설정합니다.
        };
        const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        const attributeGivenName = new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName);
        attributeList.push(attributeEmail);
        attributeList.push(attributeGivenName);
        const validationData = [
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'custom:password_length',
                Value: password.length.toString(),
            }),
        ];
        // signUp 함수는 비동기이므로 await 사용
        const result = yield new Promise((resolve, reject) => {
            userPool.signUp(username, password, attributeList, validationData, (err, result) => {
                if (err) {
                    console.error('Error registering user:', err);
                    reject(err);
                }
                else {
                    const cognitoUser = result === null || result === void 0 ? void 0 : result.user;
                    if (cognitoUser) {
                        console.log('User registered:', cognitoUser.getUsername());
                        resolve(result);
                    }
                    else {
                        reject(new Error('User registration failed.'));
                    }
                }
            });
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User registered successfully', result }),
        };
    }
    catch (error) {
        console.error('Error registering user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error registering user' }),
        };
    }
});
exports.handler = handler;
