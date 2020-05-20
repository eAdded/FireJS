"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const StaticArchitect_1 = require("./StaticArchitect");
const Fs_1 = require("../utils/Fs");
class default_1 {
    constructor($) {
        this.$ = $;
        this.staticArchitect = new StaticArchitect_1.default($);
    }
    writePath(mapComponent, pagePath) {
        return Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.dist, pagePath.Path.concat(".html")), this.staticArchitect.finalize(this.staticArchitect.render(mapComponent.chunkGroup, pagePath)));
    }
}
exports.default = default_1;
