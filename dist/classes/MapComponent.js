"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(page) {
        this.paths = [];
        this.chunkGroup = { chunks: [], babelChunk: "" };
        this.memoryFileSystem = {};
        this.page = page;
    }
    get Page() {
        return this.page;
    }
}
exports.default = default_1;
