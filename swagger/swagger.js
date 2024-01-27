// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "클래스팅 API 테스트",
    "version": "1"
  },
  "paths": {
    "/signup": {
      "post": {
        "summary": "회원가입 API",
        "description": "",
        "tags": [
          "User"
        ],
        "operationId": "signup.post./signup",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SignupDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/login": {
      "post": {
        "summary": "로그인 API",
        "description": "",
        "tags": [
          "User"
        ],
        "operationId": "login.post./login",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/LoginDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/admin/school": {
      "post": {
        "summary": "학교 등록 API",
        "description": "",
        "tags": [
          "Admin"
        ],
        "operationId": "postSchool.post.admin/school",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PostSchoolDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/admin/news": {
      "post": {
        "summary": "뉴스 등록 API",
        "description": "",
        "tags": [
          "Admin"
        ],
        "operationId": "postNews.post.admin/news",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PostNewsDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      },
      "patch": {
        "summary": "뉴스 수정 API",
        "description": "",
        "tags": [
          "Admin"
        ],
        "operationId": "patchNews.patch.admin/news",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PatchNewsDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      },
      "delete": {
        "summary": "뉴스 삭제 API",
        "description": "",
        "tags": [
          "Admin"
        ],
        "operationId": "deleteNews.delete.admin/news",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/DeleteNewsDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/student/school/all": {
      "get": {
        "summary": "모든 학교 조회 API",
        "description": "",
        "tags": [
          "student"
        ],
        "operationId": "getSchool.get.student/school/all",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/student/school/subscribe": {
      "get": {
        "summary": "구독한 학교 조회 API",
        "description": "",
        "tags": [
          "student"
        ],
        "operationId": "getSubscribeSchool.get.student/school/subscribe",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/student/subscribe": {
      "post": {
        "summary": "학교 구독 API",
        "description": "",
        "tags": [
          "student"
        ],
        "operationId": "subscribe.post.student/subscribe",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SubscribeDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      },
      "patch": {
        "summary": "학교 구독 취소 API",
        "description": "",
        "tags": [
          "student"
        ],
        "operationId": "unSubscribe.patch.student/subscribe",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SubscribeDto"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    }
  },
  "definitions": {
    "SignupDto": {
      "properties": {
        "username": {
          "title": "SignupDto.username",
          "type": "string"
        },
        "password": {
          "title": "SignupDto.password",
          "type": "string"
        },
        "email": {
          "title": "SignupDto.email",
          "type": "string"
        }
      },
      "required": [
        "username",
        "password",
        "email"
      ],
      "additionalProperties": false,
      "title": "SignupDto",
      "type": "object"
    },
    "LoginDto": {
      "properties": {
        "username": {
          "title": "LoginDto.username",
          "type": "string"
        },
        "password": {
          "title": "LoginDto.password",
          "type": "string"
        }
      },
      "required": [
        "username",
        "password"
      ],
      "additionalProperties": false,
      "title": "LoginDto",
      "type": "object"
    },
    "PostSchoolDto": {
      "properties": {
        "name": {
          "title": "PostSchoolDto.name",
          "type": "string"
        },
        "region": {
          "title": "PostSchoolDto.region",
          "type": "string"
        }
      },
      "required": [
        "name",
        "region"
      ],
      "additionalProperties": false,
      "title": "PostSchoolDto",
      "type": "object"
    },
    "PostNewsDto": {
      "properties": {
        "schoolId": {
          "title": "PostNewsDto.schoolId",
          "type": "string"
        },
        "topic": {
          "title": "PostNewsDto.topic",
          "type": "string"
        },
        "content": {
          "title": "PostNewsDto.content",
          "type": "string"
        }
      },
      "required": [
        "schoolId",
        "topic",
        "content"
      ],
      "additionalProperties": false,
      "title": "PostNewsDto",
      "type": "object"
    },
    "PatchNewsDto": {
      "properties": {
        "newsId": {
          "title": "PatchNewsDto.newsId",
          "type": "string"
        },
        "topic": {
          "title": "PatchNewsDto.topic",
          "type": "string"
        },
        "content": {
          "title": "PatchNewsDto.content",
          "type": "string"
        }
      },
      "required": [
        "newsId",
        "topic",
        "content"
      ],
      "additionalProperties": false,
      "title": "PatchNewsDto",
      "type": "object"
    },
    "DeleteNewsDto": {
      "properties": {
        "newsId": {
          "title": "DeleteNewsDto.newsId",
          "type": "string"
        }
      },
      "required": [
        "newsId"
      ],
      "additionalProperties": false,
      "title": "DeleteNewsDto",
      "type": "object"
    },
    "SubscribeDto": {
      "properties": {
        "schoolId": {
          "title": "SubscribeDto.schoolId",
          "type": "string"
        }
      },
      "required": [
        "schoolId"
      ],
      "additionalProperties": false,
      "title": "SubscribeDto",
      "type": "object"
    }
  },
  "securityDefinitions": {
    "Authorization": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    }
  },
  "basePath": "/dev",
  "schemes": [
    "http"
  ]
};