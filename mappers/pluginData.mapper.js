const PathArchitect = require("../architects/path.architect");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    mapAndBuild() {
        const pathArchitect = new PathArchitect(this.#$);
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin)();
            Object.keys(plugData).forEach(page => {
                pathArchitect.build(page, plugData[page]);
            });
        });
    }
}