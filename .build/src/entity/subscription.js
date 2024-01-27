"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const uid_1 = require("uid");
class Subscription {
    constructor(schoolId, email) {
        this.SubscriptionId = (0, uid_1.uid)();
        this.schoolId = schoolId;
        this.email = email;
        this.subscribedAt = new Date().toISOString();
        this.isDeleted = false;
    }
}
exports.Subscription = Subscription;
