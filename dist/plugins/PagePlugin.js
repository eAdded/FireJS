"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FireJSPlugin_1 = require("./FireJSPlugin");
exports.PagePlugMinVer = 0.5;
class default_1 extends FireJSPlugin_1.default {
    constructor(page) {
        super(0.5, FireJSPlugin_1.PluginCode.PagePlugin);
        this.page = page;
    }
    onBuild(renderPage, ...extra) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {});
    }
}
exports.default = default_1;
