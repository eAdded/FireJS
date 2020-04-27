const webpack = require("webpack");
const WebpackArchitect = require("../architects/webpack.architect");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    autoBuild() {
        const webpackArchitect = new WebpackArchitect(this.#$);
        return new Promise((resolve, reject) => {
            const markBuilt = (stat) => {
                const map_page = this.#$.map.get(stat.compilation.name);
                if (map_page)//prevent React and ReactDOM chunk
                    map_page.markBuilt();
            }

            const registerChunksForStat = (stat) => {
                stat.compilation.chunks.forEach(chunk => {
                    const map_page = this.#$.map.get(stat.compilation.name);
                    if (map_page)//prevent React and ReactDOM chunk
                        map_page.chunks.push(...chunk.files);
                });
            }

            if (this.#$.config.pro) {
                this.#$.cli.log("-----babel------")
                this.build(webpackArchitect.babel(this.#$.webpackConfig), multiStats => {
                    this.logMultiStat(multiStats)
                    this.#$.cli.log("-----dist------");
                    this.build(webpackArchitect.direct(undefined), (multiStats) => {
                        this.logMultiStat(multiStats, (stat) => {
                            registerChunksForStat(stat);
                            markBuilt(stat);
                        });
                        resolve();//resolve in production mode
                    }, reject);
                }, reject);
            } else {
                this.#$.cli.log("Watching");
                let firstBuild = true;
                this.build(webpackArchitect.direct(this.#$.webpackConfig), multiStats => {
                    this.logMultiStat(multiStats, (stat) => {
                        registerChunksForStat(stat);
                        if (firstBuild)//marking built is only significant for the first cycle
                            markBuilt(stat);
                    });
                    if (firstBuild) {//prevents resolve multiple times while watching
                        resolve();//resolve for first build
                        firstBuild = false;
                    }
                }, reject);
            }
        })
    }

    build(configs, resolve, reject) {
        webpack(configs, (err, multiStats) => {
            if (err)
                reject(err);
            else
                resolve(multiStats);
        });
    }

    //this.#$.cli.error("Compilation failed with exception");
    logMultiStat(multiStats, forEachCallback) {
        let errorCount = 0;
        let warningCount = 0;
        multiStats.stats.forEach(stat => {
            this.#$.cli.log(`Building Page ${stat.compilation.name}`)
            if (forEachCallback)
                forEachCallback(stat);
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
        })
        if (errorCount > 0) {
            if (this.#$.config.pro)
                this.#$.cli.log("Some errors might not be displayed in production mode. Try moving to development mode.")
            this.#$.cli.error(`Compilation failed with ${errorCount} error(s) and ${warningCount} warnings(s)`)
        } else
            this.#$.cli.ok(`Compiled successfully with ${errorCount} error(s) and ${warningCount} warnings(s)`)

    }
}