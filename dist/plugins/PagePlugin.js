"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PagePlugMinVer = void 0;
const FireJSPlugin_1 = require("./FireJSPlugin");
exports.PagePlugMinVer = 1.0;

class default_1 extends FireJSPlugin_1.default {
    constructor(page) {
        super(1.0, FireJSPlugin_1.PluginCode.PagePlugin);
        this.page = page;
    }

    onBuild(renderPage, ...extra) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")));
    }
    onRender(dom) {
    }
}
exports.default = default_1;
