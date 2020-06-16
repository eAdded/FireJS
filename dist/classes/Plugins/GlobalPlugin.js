"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FireJSPlugin_1 = require("./FireJSPlugin");
exports.GlobalPlugMinVer = 0.2;
class default_1 extends FireJSPlugin_1.default {
    constructor() {
        super(0.1, FireJSPlugin_1.PluginCode.GlobalPlugin);
    }
    initServer(server) {
    }
}
exports.default = default_1;
