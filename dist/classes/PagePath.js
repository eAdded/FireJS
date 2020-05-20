"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class default_1 {
    constructor(mapComponent, path, content, $) {
        this.map = {
            chunks: [],
            content: {},
        };
        this.path = path;
        this.map = {
            chunks: mapComponent.chunkGroup.chunks,
            content
        };
        this.map_path = path_1.join(path_1.relative($.config.paths.dist, $.config.paths.map), path + ".map.js");
    }
    get Map() {
        return this.map;
    }
    get MapPath() {
        return this.map_path;
    }
    get Path() {
        return this.path;
    }
}
exports.default = default_1;
