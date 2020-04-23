const readdir = require("recursive-dir-reader");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const map = {};
        readdir.sync(this.#$.config.paths.pages, (pagePaths) => {
            map[pagePaths.replace(this.#$.config.paths.pages + "/", "")] = {};
        })
        return map;
    };

}
