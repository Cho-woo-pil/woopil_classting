"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsFeed = void 0;
const uid_1 = require("uid");
class NewsFeed {
    constructor(newsId, username) {
        this.newsFeedId = (0, uid_1.uid)();
        this.newsId = newsId;
        this.username = username;
        this.createdAt = new Date().toISOString();
    }
}
exports.NewsFeed = NewsFeed;
