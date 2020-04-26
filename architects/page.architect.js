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
                stat.compilation.chunks.forEach(chunk => {
                    const map_page = this.#$.map[chunk.name];
                    if (map_page !== undefined)//prevent React and ReactDOM chunk
                        this.#$.map[chunk.name].markBuilt();
                });
            }
            const registerChunksForStat = (stat) => {
                stat.compilation.chunks.forEach(chunk => {
                    const map_page = this.#$.map[chunk.name];
                    if (map_page !== undefined)//prevent React and ReactDOM chunk
                        map_page.chunks = chunk.files;
                });
            }

            if (this.#$.config.pro) {
                this.#$.cli.log("-----babel------")
                this.build(webpackArchitect.babel(this.#$.webpackConfig)).then(multiStats => {
                    this.logMultiStat(multiStats,(stat)=>{
                        registerChunksForStat(stat);
                        markBuilt(stat);
                    });
                    this.#$.cli.log("-----dist------");
                    this.build(webpackArchitect.direct(undefined)).then((multiStats) => {
                        this.logMultiStat(multiStats);
                        resolve();//resolve in production mode
                    }).catch(reject);
                }).catch(reject);
            } else {
                let firstBuild = true;
                this.build(webpackArchitect.direct(this.#$.webpackConfig)).then(multiStats => {
                    this.logMultiStat(multiStats, (stat) => {
                        registerChunksForStat(stat);
                        if (firstBuild)//marking built is only significant for the first cycle
                            markBuilt(stat);
                    });
                    if (firstBuild) {//prevents resolve multiple times while watching
                        resolve();//resolve for first build
                        firstBuild = false;
                    }
                }).catch(reject);
            }
        })
    }

    async build(configs) {
        return new Promise((resolve, reject) => {
            this.#$.cli.log("Compiling")
            const instance = webpack(configs);
            if (this.#$.config.pro) { //watch in development mode
                instance.run((err, multiStats) => {
                    if (err)
                        reject(err);
                    else
                        resolve(multiStats);
                });
            } else {
                this.#$.cli.log("-----------Watching-----------");
                instance.watch({}, (err, multiStats) => {
                    if (err)
                        reject(err);
                    else
                        resolve(multiStats);
                });
            }
        })
        //this.#$.cli.error("Compilation failed with exception");
    }

    logMultiStat(multiStats, forEachCallback) {
        let errorCount = 0;
        let warningCount = 0;
        multiStats.stats.forEach(stat => {
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