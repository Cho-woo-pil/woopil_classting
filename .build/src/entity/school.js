"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const uid_1 = require("uid");
class School {
    constructor(name, region) {
        this.schoolId = (0, uid_1.uid)();
        this.name = name;
        this.region = region;
        this.createdAt = new Date().toISOString();
        this.isDeleted = false;
    }
}
exports.School = School;
