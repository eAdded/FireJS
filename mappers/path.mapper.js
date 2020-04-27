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
            map.set(rel_page, new MapComponent(page, rel_page, this.#$.template));
        })
        return map;
    };

    convertToMap(array) {
        const map = new Map();
        array.forEach(item =>
            map.set(item, new MapComponent($path.join(this.#$.config.paths.pages, item), item, this.#$.template)));
        return map;
    }

}

class MapComponent {
    #dir;
    #absPath
    #fullName;
    #ext;
    #name;
    #isCustom = false;
    #isBuilt = false;
    #isSemiBuilt = false;
    #toBeResolved = {
        full: [],
        semi: []
    };
    chunks = [];
    babelChunk = "";
    template = "";

    constructor(abs_path, page, template) {
        this.template = template;
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
            this.#toBeResolved.full.forEach(func => {
                func();
            });
            this.#toBeResolved = undefined;//mark object undefined because semi can't happen after full
        } else
            throw new Error(`Page ${this.#dir}/${this.#fullName} is already built`)
    }

    markSemiBuilt() {
        if (!this.#isSemiBuilt) {
            this.#isSemiBuilt = true;
            this.#toBeResolved.semi.forEach(func => {
                func();
            });
            this.#toBeResolved.semi = undefined;
        } else
            throw new Error(`Page ${this.#dir}/${this.#fullName} is already built`)
    }


    isBuilt() {
        return this.#isBuilt;
    }

    isSemiBuilt() {
        return this.#isSemiBuilt;
    }

    resolveWhenBuilt(func) {
        if (this.#isBuilt)
            func();
        else
            this.#toBeResolved.full.push(func);
    }

    resolveWhenSemiBuilt(func) {
        if (this.#isSemiBuilt)
            func();
        else
            this.#toBeResolved.full.push(func);
    }

    isCustom() {
        return this.#isCustom;
    }

    markCustom() {
        this.#isCustom = true;
    }
}
