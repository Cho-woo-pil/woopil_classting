import {uid} from "uid";

export class School {
    public schoolId: string;
    public name: string;
    public region: string;
    public createdAt: string;
    public isDeleted: boolean;

    constructor(name: string, region: string) {
        this.schoolId = uid();
        this.name = name;
        this.region = region;
        this.createdAt = new Date().toISOString();
        this.isDeleted = false;
    }
}