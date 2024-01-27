"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsFeed = void 0;
const uid_1 = require("uid");
class NewsFeed {
    constructor(newsId, email) {
        this.newsFeedId = (0, uid_1.uid)();
        this.newsId = newsId;
        this.email = email;
        this.createdAt = new Date().toISOString();
    }
}
exports.NewsFeed = NewsFeed;
