const webpack = require("webpack");
const WebpackArchitect = require("../architects/webpack.architect");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }


    buildExternals() {
        this.build(new WebpackArchitect(this.#$).externals(), multiStats => {
            multiStats.stats.forEach(stat=>{
                stat.compilation.chunks.forEach(chunk => {
                    this.#$.externals.push(...chunk.files);
                })
            })
        })
    }

    buildPro(mapComponent) {
        new Promise((resolve, reject) => {
            this.#$.cli.log("-----babel------")
            this.build(new WebpackArchitect(this.#$).babel(mapComponent), stat => {
                this.logStat(stat);
                mapComponent.markSemiBuilt();
                mapComponent.babelChunk = `${mapComponent.getName()}${stat.hash}.js`;
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file !== mapComponent.babelChunk)//don't add babel main
                            mapComponent.chunks.push(file);
                    })
                });
                this.#$.cli.log("------direct------")
                this.buildDev(mapComponent);
            }, reject);
        })
    }

    buildDev(mapComponent) {
        new Promise((resolve, reject) => {
            this.build(new WebpackArchitect(this.#$).direct(mapComponent), stat => {
                this.logStat(stat);
                mapComponent.markBuilt(stat);
                mapComponent.stat = stat;//set stat
                mapComponent.chunks = [];//re-init with new chunks
                stat.compilation.chunks.forEach(chunk => {
                    mapComponent.chunks.push(...chunk.files);
                });
                resolve();
            }, reject);
        });
    }

    build(config, resolve, reject) {
        webpack(config, (err, multiStats) => {
            if (err)
                reject(err);
            else
                resolve(multiStats);
        });
    }

    logStat(stat) {
        let errorCount = 0;
        let warningCount = 0;
        this.#$.cli.log(`Built chunk ${stat.compilation.name}`)
        if (this.#$.args["--verbose"]) {
            this.#$.cli.log("Stat");
            this.#$.cli.normal(stat);
        }
        if (stat.hasErrors()) {
            if (stat.compilation.errors.length === 0) {
                this.#$.cli.error(`Error in config ${stat.compilation.name}`)
                errorCount++;
            } else {
                this.#$.cli.error(`Error in config ${stat.compilation.name}\n`, ...stat.compilation.errors);
                errorCount += stat.compilation.errors.length;
            }
        }
        if (stat.hasWarnings()) {
            this.#$.cli.warn(`Warning in config ${stat.compilation.name}\n`, ...stat.compilation.warnings);
            warningCount += stat.compilation.warnings.length;
        }
        if (errorCount > 0) {
            if (this.#$.config.pro)
                this.#$.cli.log("Some errors might not be displayed in production mode. Try moving to development mode.")
            this.#$.cli.error(`Compilation failed with ${errorCount} error(s) and ${warningCount} warnings(s)`)
        } else
            this.#$.cli.ok(`Compiled successfully with ${errorCount} error(s) and ${warningCount} warnings(s)`)

    }
}