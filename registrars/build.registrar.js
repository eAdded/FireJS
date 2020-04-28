const StaticArchitect = require("../architects/static.architect");
const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    autoRegister() {
        const libRelative = _path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib);
        for (const mapComponent of this.#$.map.values())
            this.registerComponentForSemiBuild(mapComponent, _path.join(libRelative, mapComponent.getDir()));
    }

    registerComponentForSemiBuild(mapComponent, root) {
        const staticArchitect = new StaticArchitect(this.#$);
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