module.exports = class {
    #page;
    #name;
    #dir;
    #ext;
    #paths = new Map();
    chunks = [];
    babelChunk;
    stat = {};

    constructor(page) {
        this.#page = page;
        this.#dir = page.substring(0, page.lastIndexOf("/"));
        this.#name = page.substring(page.lastIndexOf("/") + 1, page.lastIndexOf("."));
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
}