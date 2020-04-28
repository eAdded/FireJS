module.exports = class {
    #path;
    content;

    constructor(path,content) {
        this.#path = path;
        this.content = content;
    }

    getPath(){
        return this.#path;
    }
}