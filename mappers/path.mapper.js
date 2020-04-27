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
    #rel_path;
    #abs_path
    #isCustom = false;
    #isBuilt = false;
    #toBeResolved = [];
    chunks = [];

    constructor(abs_path, rel_path) {
        this.#abs_path = abs_path;
        this.#rel_path = rel_path;
    }

    getAbsolutePath() {
        return this.#abs_path;
    }

    getRelativePath() {
        return this.#rel_path;
    }

    markBuilt() {
        if (!this.#isBuilt) {
            this.#isBuilt = true;
            this.#toBeResolved.forEach(func => {
                func();
            });
            this.#toBeResolved = undefined;
        } else
            throw new Error(`Page ${this.#rel_path} is already built`)
    }

    isBuilt() {
        return this.#isBuilt;
    }

    resolveWhenBuilt(func) {
        if (!this.#toBeResolved)
            throw new Error(`Can't resolve function. Page ${this.#rel_path} is already built`);
        this.#toBeResolved.push(func);
    }

    isCustom() {
        return this.#isCustom;
    }

    markCustom() {
        this.#isCustom = true;
    }
}
