"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPlugMinVer = void 0;
const FireJSPlugin_1 = require("./FireJSPlugin");
exports.GlobalPlugMinVer = 1.0;
class default_1 extends FireJSPlugin_1.default {
    constructor() {
        super(1.0, FireJSPlugin_1.PluginCode.GlobalPlugin);
    }
    initServer(server) {
    }
    initDom(dom) {
    }
}
exports.default = default_1;
