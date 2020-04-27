const StaticArchitect = require("../architects/static.architect");
const _path = require("path");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    autoRegister() {
        const libRelative = _path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib);
        for (const mapComponent of this.#$.map.value())
            this.registerComponentForSemiBuild(mapComponent, libRelative);
    }

    registerComponentForSemiBuild(mapComponent, libRelative) {
        const staticArchitect = new StaticArchitect(this.#$);
        mapComponent.resolveWhenSemiBuilt(() => {
            mapComponent.chunks.forEach(chunk => {//copy chunks to lib
                mapComponent.template = staticArchitect.addChunk(mapComponent.template, `${libRelative}/${chunk}`);
                const absDir = _path.join(this.#$.config.paths.dist, mapComponent.getDir());
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