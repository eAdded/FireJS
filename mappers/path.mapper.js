const readdir = require("recursive-dir-reader");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const map = {};
        readdir.sync(this.#$.config.paths.pages, (page) => {
            map[page.replace(this.#$.config.paths.pages + "/", "")] = new MapComponent(page);
        })
        return map;
    };

    convertToMap(array) {
        const map = {};
        array.forEach(item => {
            map[item] = new MapComponent(item);
        })
        return map;
    }

}

class MapComponent {
    page;
    #isBuilt = false;
    #toBeResolved = [];

    constructor(_page) {
        this.page = _page;
    }

    markBuilt() {
        if(!this.#isBuilt) {
            this.#isBuilt = true;
            this.#toBeResolved.forEach(func => {
                func();
            });
            this.#toBeResolved = undefined;
        }else
            throw new Error(`Page ${this.page} is already built`)
    }

    isBuilt() {
        return this.#isBuilt;
    }

    resolveWhenBuilt(func) {
        if (this.#toBeResolved === undefined)
            throw new Error(`Can't resolve function. Page ${this.page} is already built`);
        this.#toBeResolved.push(func);
    }
}
