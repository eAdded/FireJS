const StaticArchitect = require("../architects/static.architect");
const _path = require("path");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    build(page, paths, template) {
        if (this.#$.map[page] === undefined) {//check if this page already exists
            console.error(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`);
            throw new Error();
        } else {
            try {
                paths.forEach(path => {
                    if (typeof path === "string") {
                        console.log(StaticArchitect.createStatic(_path.join(this.#$.config.paths.babel,page), {}, template));
                    }
                });
            } catch (e) {
                if (!Array.isArray(paths)) {
                    console.error(`Expected array got ${typeof paths}`)
                    throw new Error();
                } else
                    throw e;
            }
        }
    }

}