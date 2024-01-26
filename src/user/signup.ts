import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-2_JI67K0OTA',
    ClientId: '369drbea2dsktk1te160clt3f6'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const handler = async (event: any) => {
    try {
        const {username, email, password } = JSON.parse(event.body);

        // 클라이언트 측에서 비밀번호 길이를 검증
        if (password.length < 8) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Password must be at least 8 characters long' }),
            };
        }

        const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [];
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

        const validationData: AmazonCognitoIdentity.CognitoUserAttribute[] | null = [
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'custom:password_length',
                Value: password.length.toString(),
            }),
        ];

        // signUp 함수는 비동기이므로 await 사용
        const result = await new Promise((resolve, reject) => {
            userPool.signUp(username, password, attributeList, validationData, (err, result) => {
                if (err) {
                    console.error('Error registering user:', err);
                    reject(err);
                } else {
                    const cognitoUser = result?.user;
                    if (cognitoUser) {
                        console.log('User registered:', cognitoUser.getUsername());
                        resolve(result);
                    } else {
                        reject(new Error('User registration failed.'));
                    }
                }
            });
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User registered successfully', result }),
        };
    } catch (error) {
        console.error('Error registering user:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error registering user' }),
        };
    }
};
