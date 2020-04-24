const StaticArchitect = require("../architects/static.architect");
const _path = require("path");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    build(page, path,content , template) {
        console.log(StaticArchitect.createStatic(_path.join(this.#$.config.paths.babel, page), content, template));
    }

}