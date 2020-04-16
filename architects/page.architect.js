const webpack = require("webpack");
const readdir = require("recursive-dir-reader");
const webpackArchitect = require("../architects/webpack.architect");
const {config, args} = require("../config/global.config");
const cli = require("../utils/cli-color");
/**
 *
 */
module.exports = () => {
    return module.exports.fromPages(readdir.sync(config.pages));
}
/**
 * Creates webpackConfig according to page and passes to this(config)
 * @param {string[]} pages array of absolute path to pages
 */
module.exports.fromPages = (pages) => {
    return module.exports.fromConfigs([webpackArchitect(pages)]);
}

/**
 * compiles page using webpack according to config
 * @param {Object[]} configs Array of webpack configuration
 */
module.exports.fromConfigs = configs => {
    cli.log("Compiling")
    try {
        webpack(configs, (err, multiStats) => {
            if (err)
                cli.throwError(new Error("Error while compiling : " + err));
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
                if (config.mode === "production")
                    cli.log("Some errors might not be displayed in production mode. Try moving to development mode.")
                cli.error(`Compilation failed with ${errorCount} error(s) and ${warningCount} warnings(s)`)
            } else
                cli.ok(`Compiled successfully with ${errorCount} error(s) and ${warningCount} warnings(s)`)
        });
    } catch (exception) {
        cli.throwError(`Compilation failed with exception :\n${exception}`)
    }
}