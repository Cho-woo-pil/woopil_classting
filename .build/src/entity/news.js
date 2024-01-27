"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const uid_1 = require("uid");
class News {
    constructor(schoolId, topic, content) {
        this.newsId = (0, uid_1.uid)();
        this.schoolId = schoolId;
        this.topic = topic;
        this.content = content;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.isDeleted = false;
    }
}
exports.News = News;
