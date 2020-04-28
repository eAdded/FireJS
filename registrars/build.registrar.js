const StaticArchitect = require("../architects/static.architect");
const PathArchitect = require("../architects/path.architect");
const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }


    registerForSemiBuild() {
        const libRelative = _path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib);
        const staticArchitect = new StaticArchitect(this.#$);

        for (const mapComponent of this.#$.map.values()) {
            const root = _path.join(libRelative, mapComponent.getDir());
            mapComponent.resolveOnSemiBuild(() => {
                mapComponent.chunks.forEach(chunk => {//copy chunks to lib
                    staticArchitect.addChunk(mapComponent, chunk, root);
                    if (this.#$.config.pro) {//only copy in production mode
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
                    }
                });
            });
        }
    }

    registerComponentForBuild() {
        if (this.#$.config.pro) {//only write when pro else it is rendered
            const pathArchitect = new PathArchitect(this.#$);
            for (const mapComponent of this.#$.map.values()) {
                mapComponent.resolveOnBuild(() => {
                    pathArchitect.writePath(mapComponent);
                })
            }
        }
    }
}