"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class default_1 {
    constructor(mapComponent, path, content, rel) {
        this.map = {
            chunks: [],
            content: {},
        };
        this.path = path;
        this.map = {
            chunks: mapComponent.chunkGroup.chunks,
            content
        };
        this.map_path = path_1.join(rel.mapRel, path + ".map.js");
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
