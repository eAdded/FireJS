const webpack = require("webpack");
const webpackArchitect = require("../architects/webpack.architect");
/**
 * Creates webpackConfig according to page and passes to this(config)
 * @param {string[]} pages array of absolute path to pages
 */
module.exports = (pages) => {
    return module.exports.fromConfigs([webpackArchitect(pages)]);
}

/**
 * compiles page using webpack according to config
 * @param {Object[]} configs Array of webpack configuration
 */
module.exports.fromConfigs = configs => {
    webpack(configs, (err, stats) => {
        if (process.argv[2] === "v")
            console.log("Stat -> ", stats);
        if (err || stats.hasErrors()) {
            console.error({...stats});
            throw {err}
        } else {
            console.log("Compiled Successfully");
        }
    });
}