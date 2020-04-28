const PathArchitect = require("../architects/path.architect");
const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }


    registerForSemiBuild() {
        if (this.#$.config.pro) {//only write when pro else it is rendered
            for (const mapComponent of this.#$.map.values()) {
                mapComponent.resolveOnSemiBuild(() => {
                    mapComponent.chunks.forEach(chunk => {//copy chunks to lib
                        const absDir = _path.join(this.#$.config.paths.lib, mapComponent.getDir());
                        fs.mkdir(absDir, {recursive: true}, err => {
                            if (err) {
                                this.#$.cli.log("Error making dir " + absDir);
                                throw err;
                            }
                            fs.rename(_path.join(this.#$.config.paths.babel, mapComponent.getDir(), chunk), _path.join(absDir, chunk), _ => {
                                this.#$.cli.log("Moved chunk " + chunk);
                            });
                        });
                    });
                });
            }
        }
    }

    registerComponentForBuild() {
        if (this.#$.config.pro) {//only write when pro else it is rendered
            const pathArchitect = new PathArchitect(this.#$);
            for (const mapComponent of this.#$.map.values()) {
                mapComponent.resolveOnBuild(() => {
                    for (const pagePath of mapComponent.getPaths().values())
                        pathArchitect.writePath(mapComponent, pagePath)
                            .then(_ => {
                                this.#$.cli.ok(`Path ${pagePath.getPath()} written`)
                            }).catch(e => {
                            this.#$.cli.error(`Error writing path ${pagePath.getPath()}`)
                            throw e;
                        });
                })
            }
        }
    }
}