"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../classes/Page");
const Fs_1 = require("../utils/Fs");
function createMap(path_to_pages, inputFileSystem) {
    const map = new Map();
    Fs_1.readDirRecursively(path_to_pages, inputFileSystem, (page) => {
        const rel_page = page.replace(path_to_pages + "/", "");
        map.set(rel_page, new Page_1.default(rel_page));
    });
    return map;
}
exports.createMap = createMap;
function convertToMap(array) {
    const map = new Map();
    array.forEach(item => map.set(item, new Page_1.default(item)));
    return map;
}
exports.convertToMap = convertToMap;
