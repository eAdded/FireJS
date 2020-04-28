const _path = require("path");
module.exports = class {
    #path;
    #content;
    #contentPath;

    constructor(path, content, $) {
        this.#path = path;
        if (content) {
            this.#content = content;
            this.#contentPath = _path.join(_path.relative($.config.paths.dist, $.config.paths.pageData),path.concat(".js"));
        }
    }

    hasContent() {
        return !!this.#content;
    }

    getContent() {
        return this.#content;
    }

    getContentPath() {
        return this.#contentPath;
    }

    getPath() {
        return this.#path;
    }
}