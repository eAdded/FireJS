"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(page) {
        this.paths = [];
        this.chunks = [];
        this.memoryFileSystem = {};
        this.page = page;
        this.name = page.substring(page.lastIndexOf("/") + 1, page.lastIndexOf("."));
        this.ext = page.substring(page.lastIndexOf("."));
    }
    get Page() {
        return this.page;
    }
    get Ext() {
        return this.ext;
    }
    get Name() {
        return this.name;
    }
}
exports.default = default_1;
