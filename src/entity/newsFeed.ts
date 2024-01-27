import {uid} from "uid";

export class NewsFeed {
    public newsFeedId: string;
    public newsId: string
    public email: string;
    public createdAt: string;


    constructor(newsId: string, email: string) {
        this.newsFeedId = uid();
        this.newsId = newsId;
        this.email = email;
        this.createdAt = new Date().toISOString();
    }
}