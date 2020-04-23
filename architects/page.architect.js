const webpack = require("webpack");
const WebpackArchitect = require("../architects/webpack.architect");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    autoBuild(userWebpack) {
        const webpackArchitect = new WebpackArchitect(this.#$);
        userWebpack = userWebpack || webpackArchitect.getUserConfig();
        if (this.#$.config.pro) {
            this.#$.cli.log("-----babel------")
            this.build(webpackArchitect.babel(userWebpack), () => {
                this.#$.cli.log("-----dist------")
                this.buildFromConfig(webpackArchitect.direct(userWebpack), undefined);
            })
        } else
            this.build(webpackArchitect.direct(userWebpack));
    }

    build(config, callback = undefined, log = true) {
        try {
            if (log)
                this.#$.cli.log("Compiling")
            webpack(config, (err, multiStats) => {
                if (log) {
                    if (err) {
                        this.#$.cli.error("Error while compiling")
                        throw err;
                    }
                    let errorCount = 0;
                    let warningCount = 0;
                    multiStats.stats.forEach(stat => {
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
                if (callback)
                    callback(err, multiStats);
            });
        } catch (exception) {
            if (callback)
                callback(exception, null);
            else {
                this.#$.cli.error("Compilation failed with exception");
                throw exception;
            }
        }
    }
}