const readdir = require("recursive-dir-reader");
const $path = require("path");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const map = new Map();
        readdir.sync(this.#$.config.paths.pages, (page) => {
            const rel_page = page.replace(this.#$.config.paths.pages + "/", "")
            map.set(rel_page, new MapComponent(page, rel_page));
        })
        return map;
    };

    convertToMap(array) {
        const map = new Map();
        array.forEach(item =>
            map.set(item, new MapComponent($path.join(this.#$.config.paths.pages, item), item)))
        return map;
    }

}

class MapComponent {
    #page;
    #dir;
    #absPath
    #fullName;
    #ext;
    #name;
    #isCustom = false;
    #isBuilt = false;
    #toBeResolved = [];
    chunks = [];

    constructor(abs_path, page) {
        this.#page = page;
        this.#absPath = abs_path;
        this.#dir = page.substr(0, page.lastIndexOf("/"));
        this.#fullName = page.substr((() => {
            const index = page.lastIndexOf("/");
            return index === -1 ? 0 : index;
        })());
        this.#name = this.#fullName.substr(0, this.#fullName.lastIndexOf("."));
        this.#ext = this.#fullName.substr(this.#fullName.lastIndexOf("."));
    }

    getFullName() {
        return this.#fullName;
    }

    getExt() {
        return this.#ext;
    }

    getName() {
        return this.#name;
    }

    getAbsolutePath() {
        return this.#absPath;
    }

    getDir() {
        return this.#dir;
    }

    markBuilt() {
        if (!this.#isBuilt) {
            this.#isBuilt = true;
            this.#toBeResolved.forEach(func => {
                func();
            });
            this.#toBeResolved = undefined;
        } else
            throw new Error(`Page ${this.#page} is already built`)
    }

    isBuilt() {
        return this.#isBuilt;
    }

    resolveWhenBuilt(func) {
        if (!this.#toBeResolved)
            throw new Error(`Can't resolve function. Page ${this.#page} is already built`);
        this.#toBeResolved.push(func);
    }

    isCustom() {
        return this.#isCustom;
    }

    markCustom() {
        this.#isCustom = true;
    }
}
