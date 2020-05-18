"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const StaticArchitect_1 = require("./StaticArchitect");
const Fs_1 = require("../utils/Fs");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    writePath(mapComponent, pagePath) {
        const staticArchitect = new StaticArchitect_1.default(this.$);
        const html = staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath));
        return Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.dist, pagePath.Path.concat(".html")), html);
    }
}
exports.default = default_1;
