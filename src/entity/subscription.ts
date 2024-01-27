import {uid} from "uid";

export class Subscription {
    public SubscriptionId: string;
    public schoolId: string;
    public email: string;
    public subscribedAt: string;
    public deletedAt?: string;
    public isDeleted: boolean;

    constructor(schoolId:string, email: string) {
        this.SubscriptionId = uid();
        this.schoolId = schoolId;
        this.email = email;
        this.subscribedAt = new Date().toISOString();
        this.isDeleted = false;
    }
}