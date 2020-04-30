const PathArchitect = require("../architects/path.architect");
const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    registerForSemiBuild(mapComponent) {
        return new Promise((resolve, reject) => {
            const absDir = _path.join(this.#$.config.paths.lib, mapComponent.getDir());
            fs.mkdir(absDir, {recursive: true}, err => {
                if (err)
                    reject("Error making dir " + absDir);
                else {
                    if(mapComponent.chunks.length === 0)
                        resolve();
                    mapComponent.chunks.forEach(chunk => {//copy chunks to lib
                        fs.rename(_path.join(this.#$.config.paths.babel, mapComponent.getDir(), chunk), _path.join(absDir, chunk), err => {
                            if (err)
                                reject("Error moving chunk " + chunk);
                            else
                                resolve();
                        });
                    });
                }
            });
        });
    }

    registerComponentForBuild(mapComponent) {
        return new Promise((resolve, reject) => {
            const pathArchitect = new PathArchitect(this.#$);
            const promises = [];
            for (const pagePath of mapComponent.getPaths().values())
                promises.push(pathArchitect.writePath(mapComponent, pagePath));
            Promise.all(promises).then(resolve).catch(reject);
        });
    }
}