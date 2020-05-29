"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(page) {
        this.paths = new Map();
        this.page = page;
    }
    onBuild(renderPage, callback) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {});
        callback();
    }
    onRequest(req, res) {
    }
}
exports.default = default_1;
