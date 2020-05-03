module.exports = class {
    #page;
    #name;
    #ext;
    paths = [];
    chunks = [];
    babelChunk;
    stat = {};
    plugin = undefined;

    constructor(page) {
        this.#page = page;
        this.#name = page.substring(page.lastIndexOf("/") + 1, page.lastIndexOf("."));
        this.#ext = page.substring(page.lastIndexOf("."));
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

}