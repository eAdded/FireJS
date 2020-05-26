"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugin_1 = require("./Plugin");
class default_1 {
    constructor(page) {
        this.chunks = [];
        this.name = page;
        this.plugin = new Plugin_1.default(this.name);
    }
    toString() {
        return this.name;
    }
}
exports.default = default_1;
