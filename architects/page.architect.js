const webpack = require("webpack");
const WebpackArchitect = require("../architects/webpack.architect");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }


    buildExternals() {
        return new Promise((resolve, reject) => {
            this.build(new WebpackArchitect(this.#$).externals(), stat => {
                stat.compilation.chunks.forEach(chunk => {
                    this.#$.externals.push(...chunk.files);
                })
                resolve();
            }, reject)
        })
    }

    buildBabel(mapComponent, resolve, reject) {
        this.build(new WebpackArchitect(this.#$).babel(mapComponent), stat => {
            if (this.logStat(stat))//true if errors
                reject();
            else {
                filterMainChunk(stat, mapComponent, "babelChunk")
                resolve();
            }
        }, err => reject(err));
    }

    buildDirect(mapComponent, resolve, reject) {
        this.build(new WebpackArchitect(this.#$).direct(mapComponent), stat => {
            if (!this.#$.config.pro)
                mapComponent.chunks = []; //re init for new chunks
            mapComponent.stat = stat;//set stat
            if (this.logStat(stat))//true if errors
                reject();
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunks.unshift(file);//add main chunk to the top
                        } else
                            mapComponent.chunks.push(file);
                    })
                });
                resolve();
            }
        }, reject);
    }

    build(config, resolve, reject) {
        webpack(config, (err, stat) => {
            if (err)
                reject(err);
            else
                resolve(stat);
        });
    }

    logStat(stat) {
        let errorCount = 0;
        if (this.#$.args["--verbose"]) {
            this.#$.cli.log("Stat");
            this.#$.cli.normal(stat);
        }
        if (stat.hasWarnings()) {
            this.#$.cli.warn(`Warning in page ${stat.compilation.name}\n`, ...stat.compilation.warnings);
        }
        if (stat.hasErrors()) {
            if (stat.compilation.errors.length === 0)
                this.#$.cli.error(`Error in page ${stat.compilation.name}`)
            else {
                this.#$.cli.error(`Error in page ${stat.compilation.name}\n`, ...stat.compilation.errors);
            }
            if (this.#$.config.pro)
                this.#$.cli.log("Some errors might not be displayed in production mode. Try moving to development mode.")
            this.#$.cli.error(`Unable to build page ${stat.compilation.name} with ${errorCount} error(s)`)
            return true;
        }
    }
}

function filterMainChunk(stat, mapComponent, property) {
    stat.compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
            if (file.startsWith("m")) {
                mapComponent[property] = file;
            } else //don't add babel main
                mapComponent.chunks.push(file);
        })
    });
}