"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(mapComponent, path, content, rel) {
        this.path = path;
        this.map = {
            chunks: mapComponent.chunkGroup.chunks,
            content
        };
        this.map_path = ;
    }
    getMap() {
        return this.map;
    }
    getPathToMap() {
        return this.map_path;
    }
    getPath() {
        return this.path;
    }
}
exports.default = default_1;
