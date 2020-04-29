module.exports =  class {
    #page;
    #name;
    #dir;
    #ext;
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
    stat = {};
    constructor(page) {
        this.#page = page;
        this.#dir = page.substring(0, page.lastIndexOf("/"));
        this.#name = page.substring(page.lastIndexOf("/")+1, page.lastIndexOf("."));
        this.#ext = page.substring(page.lastIndexOf("."));
    }

    getPaths() {
        return this.#paths;
    }

    getPage() {
        return this.#page;
    }

    getExt() {
        return this.#ext;
    }

    getName() {
        return this.#name;
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