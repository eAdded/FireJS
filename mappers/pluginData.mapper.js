const PathArchitect = require("../architects/path.architect");
const fs = require("fs");
const path = require("path");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    mapAndBuild() {
        const pathArchitect = new PathArchitect(this.#$);
        const template = fs.readFileSync(path.resolve(__dirname, '../web/template.html')).toString();
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin)();
            Object.keys(plugData).forEach(page => {
                pathArchitect.build(page, plugData[page],template);
            });
        });
    }
}