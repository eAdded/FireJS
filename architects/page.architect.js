const webpack = require("webpack");
const webpackArchitect = require("../architects/webpack.architect");
const cli = require("../utils/cli-color");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    build() {
        const userWebpack = webpackArchitect.getUserConfig();
        if (this.#$.config.pro) {
            cli.log("-----babel------")
            module.exports.fromConfigs(webpackArchitect.babel(userWebpack), () => {
                cli.log("-----dist------")
                module.exports.fromConfigs(webpackArchitect.direct(userWebpack), undefined);
            })
        } else
            module.exports.fromConfigs(webpackArchitect.direct(userWebpack));
    }
}

/**
 *
 * @param {Object[]} configs Array of webpack configuration
 * @param {function(Object,Object)} callback
 * @param {Boolean} log
 */
module.exports.fromConfigs = (configs, callback = undefined, log = true) => {
    try {
        if (log)
            cli.log("Compiling")
        webpack(configs, (err, multiStats) => {
            if (log) {
                if (err) {
                    cli.error("Error while compiling")
                    throw err;
                }
                let errorCount = 0;
                let warningCount = 0;
                multiStats.stats.forEach(stat => {
                    if (args["--verbose"]) {
                        cli.log("Stat");
                        cli.normal(stat);
                    }
                    if (stat.hasErrors()) {
                        if (stat.compilation.errors.length === 0) {
                            cli.error(`Error in config ${stat.compilation.name}`)
                            errorCount++;
                        } else {
                            cli.error(`Error in config ${stat.compilation.name}\n`, ...stat.compilation.errors);
                            errorCount += stat.compilation.errors.length;
                        }
                    }
                    if (stat.hasWarnings()) {
                        cli.warn(`Warning in config ${stat.compilation.name}\n`, ...stat.compilation.warnings);
                        warningCount += stat.compilation.warnings.length;
                    }
                })
                if (errorCount > 0) {
                    if (config.pro)
                        cli.log("Some errors might not be displayed in production mode. Try moving to development mode.")
                    cli.error(`Compilation failed with ${errorCount} error(s) and ${warningCount} warnings(s)`)
                } else
                    cli.ok(`Compiled successfully with ${errorCount} error(s) and ${warningCount} warnings(s)`)
            }
            if (callback)
                callback(err, multiStats);
        });
    } catch (exception) {
        if (callback)
            callback(exception, null);
        else {
            cli.error("Compilation failed with exception");
            throw exception;
        }
    }
}