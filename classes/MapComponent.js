export default class {
    #page;
    #dir;
    #absPath
    #fullName;
    #ext;
    #name;
    #custom = false;
    #built = false;
    #semiBuilt = false;
    #toBeResolved = {
        full: [],
        semi: []
    };
    #paths = new Map();
    chunks = [];
    babelChunk;

    constructor(abs_path, page) {
        this.#absPath = abs_path;
        this.#page = page;
        this.#dir = page.substr(0, page.lastIndexOf("/"));
        this.#fullName = page.substr((() => {
            const index = page.lastIndexOf("/");
            return index === -1 ? 0 : index;
        })());
        this.#name = this.#fullName.substr(0, this.#fullName.lastIndexOf("."));
        this.#ext = this.#fullName.substr(this.#fullName.lastIndexOf("."));
    }

    getPaths() {
        return this.#paths;
    }

    getPage() {
        return this.#page;
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
        this.#built = true;
        this.#toBeResolved.full.forEach(func => {
            func();
        });
    }

    markSemiBuilt() {
        if (!this.isSemiBuilt()) {
            this.#semiBuilt = true;
            this.#toBeResolved.semi.forEach(func => {
                func();
            });
            this.#toBeResolved.semi = undefined;
        } else
            throw new Error(`Page ${this.#page} is already Build`)
    }

    isBuilt() {
        return this.#built;
    }

    isSemiBuilt() {
        return this.#semiBuilt;
    }

    resolveOnBuild(func) {
        this.#toBeResolved.full.push(func);
    }

    resolveOnSemiBuild(func) {
        if (this.isSemiBuilt())
            func();
        else
            this.#toBeResolved.full.push(func);
    }

    isCustom() {
        return this.#custom;
    }

    markCustom() {
        this.#custom = true;
    }
}