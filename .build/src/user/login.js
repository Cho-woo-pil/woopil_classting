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
        const { username, password } = JSON.parse(event.body);
        const authenticationData = {
            Username: username,
            Password: password
        };
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        const result = yield new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (session) => {
                    resolve(session);
                },
                onFailure: (err) => {
                    console.error('Error during authentication:', err);
                    reject(err);
                },
            });
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Authentication successful', result }),
        };
    }
    catch (error) {
        console.error('Error during authentication:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error during authentication' }),
        };
    }
});
exports.handler = handler;
