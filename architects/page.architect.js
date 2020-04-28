const webpack = require("webpack");
const WebpackArchitect = require("../architects/webpack.architect");
const StaticArchitect = require("../architects/static.architect");
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
                const mapComponent = this.#$.map.get(stat.compilation.name);
                if (mapComponent) {
                    if (this.#$.config.pro) {
                        if (!mapComponent.babelChunk)//this function is called 2 times during production
                            mapComponent.babelChunk = `${mapComponent.getName()}${stat.hash}.js`;
                        stat.compilation.chunks.forEach(chunk => {
                            chunk.files.forEach(file => {
                                if (file !== mapComponent.babelChunk)//don't add babel main
                                    mapComponent.chunks.push(file);
                            })
                        });
                    } else {
                        stat.compilation.chunks.forEach(chunk => {
                            mapComponent.chunks.push(...chunk.files);
                        });
                    }
                }
            }

            this.build(webpackArchitect.externals(),stat=>{
                const externals = [];
                stat.compilation.chunks.forEach(chunk=>{
                    externals.push(...chunk.files);
                })
                const staticArchitect = new StaticArchitect(this.#$);
                for(const mapComponent of this.#$.map.values()){
                    externals.forEach(external=>{
                        staticArchitect.addChunk(mapComponent,external);
                    })
                }
                if (this.#$.config.pro) {
                    this.#$.cli.log("-----babel------")
                    this.build(webpackArchitect.babel(this.#$.webpackConfig), multiStats => {
                        this.logMultiStat(multiStats, stat => {
                            registerChunksForStat(stat);
                            this.#$.map.get(stat.compilation.name).markSemiBuilt();
                        });
                        this.#$.cli.log("-----dist------");
                        this.build(webpackArchitect.direct(undefined), multiStats => {
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
            this.#$.cli.log(`Built chunk ${stat.compilation.name}`)
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