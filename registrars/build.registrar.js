const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    registerForSemiBuild(mapComponent) {
        return new Promise((resolve, reject) => {
            if (mapComponent.chunks.length === 0)
                resolve();
            mapComponent.chunks.forEach(chunk => {//copy chunks to lib
                const babel_abs_path = _path.join(this.#$.config.paths.babel, chunk);
                fs.exists(babel_abs_path, exists => {
                    if (exists) {//only copy if it exists because it might be already copied before for page having same chunk
                        fs.rename(babel_abs_path, _path.join(this.#$.config.paths.lib, chunk), err => {
                            if (err)
                                reject("Error moving chunk " + chunk);
                            else
                                resolve();
                        });
                    }else
                        resolve();
                })
            });
        });
    }
}