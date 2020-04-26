const readdir = require("recursive-dir-reader");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const map = {};
        readdir.sync(this.#$.config.paths.pages, (pagePaths) => {
            map[pagePaths.replace(this.#$.config.paths.pages + "/", "")] = this.defaultMap();
        })
        return map;
    };

    convertToMap(array) {
        const map = {};
        array.forEach(item => {
            map[item] = this.defaultMap();
        })
        return map;
    }

    defaultMap() {
        return {
            isBuilt: false
        }
    }
}
