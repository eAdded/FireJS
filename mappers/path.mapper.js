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
            map.set(rel_page.substr(0, rel_page.lastIndexOf('.')), new MapComponent(page, rel_page));
        })
        return map;
    };

    convertToMap(array) {
        const map = new Map();
        array.forEach(item =>
            map.set(item.substr(0, item.lastIndexOf('.')), new MapComponent($path.join(this.#$.config.paths.pages, item), item)))
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
        this.#abs_path = abs_path;
        this.#parsedPath = $path.parse(abs_path);
        this.#fullName = page.substr(page.lastIndexOf("/"));
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
