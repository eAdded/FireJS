const readdir = require("recursive-dir-reader");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const map = {};
        readdir.sync(this.#$.config.paths.pages, (pagePaths) => {
            map[pagePaths.replace(this.#$.config.paths.pages + "/", "")] = {didRender : false};
        })
        return map;
    };
    convertToMap(array){
        const map = {};
        array.forEach(item => {
            map[item] = {didRender : false};
        })
        return map;
    }
}
