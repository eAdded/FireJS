"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PluginCode;
(function (PluginCode) {
    PluginCode[PluginCode["GlobalPlugin"] = 0] = "GlobalPlugin";
    PluginCode[PluginCode["PagePlugin"] = 1] = "PagePlugin";
})(PluginCode = exports.PluginCode || (exports.PluginCode = {}));
class Plugin {
    constructor(version, plugCode) {
        this.plugCode = plugCode;
        this.version = version;
    }
}
exports.default = Plugin;
