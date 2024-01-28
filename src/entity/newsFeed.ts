import {uid} from "uid";

export class NewsFeed {
    public newsFeedId: string;
    public newsId: string;
    public schoolId: string;
    public username: string;
    public createdAt: string;


    constructor(newsId: string, schoolId:string, username: string) {
        this.newsFeedId = uid();
        this.newsId = newsId;
        this.schoolId = schoolId;
        this.username = username;
        this.createdAt = new Date().toISOString();
    }
}