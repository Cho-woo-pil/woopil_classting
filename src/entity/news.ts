import {uid} from "uid";

export class News {
    public newsId: string;
    public schoolId: string;
    public topic: string;
    public content: string;
    public createdAt: string;
    public updatedAt: string;
    public deletedAt?: string;
    public isDeleted: boolean;

    constructor(schoolId: string, topic: string, content: string) {
        this.newsId = uid();
        this.schoolId = schoolId;
        this.topic = topic;
        this.content = content;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.isDeleted = false;
    }
}