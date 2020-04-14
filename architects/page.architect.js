const webpack = require("webpack");
const readdir = require("recursive-dir-reader");
const webpackArchitect = require("../architects/webpack.architect");
const config = require("../config/global.config");
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
    webpack(configs, (err, multiStats) => {
        if (err)
            cli.error("Error while compiling : ", err);
        multiStats.stats.forEach(stat => {
            if (config["--verbose"]) {
                cli.log("Stat");
                console.log(stat);
            }
            if (stat.hasErrors())
                cli.error(`Error in config ${stat.compilation.name}`, ...stat.compilation.errors);
            if (stat.hasWarnings())
                cli.warn(`Warning in config ${stat.compilation.name}`, ...stat.compilation.warnings)
        })
    });
}