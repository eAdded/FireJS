"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recursive_dir_reader_1 = require("recursive-dir-reader");
const MapComponent_1 = require("../classes/MapComponent");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    map() {
        const map = new Map();
        recursive_dir_reader_1.sync(this.$.config.paths.pages, (page) => {
            const rel_page = page.replace(this.$.config.paths.pages + "/", "");
            map.set(rel_page, new MapComponent_1.default(rel_page));
        });
        return map;
    }
    ;
    convertToMap(array) {
        const map = new Map();
        array.forEach(item => map.set(item, new MapComponent_1.default(item)));
        return map;
    }
}
exports.default = default_1;
