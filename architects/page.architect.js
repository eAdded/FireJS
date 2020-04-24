const _webpack = require("webpack");
const WebpackArchitect = require("../architects/webpack.architect");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    autoBuild(callback) {
        const webpackArchitect = new WebpackArchitect(this.#$);
        if (this.#$.config.pro) {
            this.#$.cli.log("-----babel------")
            this.build(webpackArchitect.babel(this.#$.webpackConfig), () => {
                this.#$.cli.log("-----dist------")
                this.build(webpackArchitect.direct(this.#$.webpackConfig), callback);
            });
        } else
            this.build(webpackArchitect.direct(this.#$.webpackConfig), callback);

    }

    build(config, callback = undefined) {
        try {
            this.#$.cli.log("Compiling")
            const webpack = _webpack(config);
            webpack.run((err, multiStats) => {
                if (err) {
                    this.#$.cli.error("Error while compiling")
                    throw err;
                }
                let errorCount = 0;
                let warningCount = 0;
                multiStats.stats.forEach(stat => {
                    stat.compilation.chunks.forEach(chunk => {
                        const map_page = this.#$.map[chunk.name];
                        if (map_page !== undefined)//prevent React and ReactDOM chunk
                            map_page.chunks = chunk.files;
                    });
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

                if (callback)
                    callback();
            });
            webpack.watch({}, (err, stat) => {
                console.log(stat);
            })
        } catch (exception) {
                this.#$.cli.error("Compilation failed with exception");
            throw exception;
        }
    }
}