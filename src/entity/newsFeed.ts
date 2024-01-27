import {uid} from "uid";

export class NewsFeed {
    public newsFeedId: string;
    public newsId: string
    public username: string;
    public createdAt: string;


    constructor(newsId: string, username: string) {
        this.newsFeedId = uid();
        this.newsId = newsId;
        this.username = username;
        this.createdAt = new Date().toISOString();
    }
}