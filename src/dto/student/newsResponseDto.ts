export class NewsResponseDto {
    public schoolId: string;
    public schoolname: string;
    public region: string;
    public newsId: string;
    public topic: string;
    public content: string;
    public createdAt: string;

    constructor(
        schoolId: string,
        schoolname: string,
        region: string,
        newsId: string,
        topic: string,
        content: string,
        createdAt: string
    ) {
        this.schoolId = schoolId;
        this.schoolname = schoolname;
        this.region = region;
        this.newsId = newsId;
        this.topic = topic;
        this.content = content;
        this.createdAt = createdAt;
    }

}