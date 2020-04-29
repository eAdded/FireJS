const readdir = require("recursive-dir-reader");
const $path = require("path");
const MapComponent = require("../classes/MapComponent");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const map = new Map();
        readdir.sync(this.#$.config.paths.pages, (page) => {
            const rel_page = page.replace(this.#$.config.paths.pages + "/", "")
            map.set(rel_page, new MapComponent(rel_page));
        })
        return map;
    };

    convertToMap(array) {
        const map = new Map();
        array.forEach(item =>
            map.set(item, new MapComponent(item)));
        return map;
    }

}