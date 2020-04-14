const webpack = require("webpack");
const webpackArchitect = require("../architects/webpack.architect");
const basicConfig = require("../config/default.config")
const path = require("path")
/**
 * Creates webpackConfig according to page and passes to this(config)
 * @param {string[]} pages array of absolute path to pages
 */
module.exports = (pages) => {
    let pageConfigs = [];
    pages.forEach((page) => {
        pageConfigs.push(webpackArchitect(page));
    })
    return module.exports.fromConfigs(pageConfigs);
}

/**
 * compiles page using webpack according to config
 * @param {Object[]} configs Array of webpack configuration
 */
module.exports.fromConfigs = configs => {
    webpack(configs, (err, stats) => {
        if (process.argv[2] === "v")
            console.log("Stat -> ", stats.toJson());
        if (err || stats.hasErrors()) {
            console.error({...stats});
            throw {err}
        } else {
            console.log("Compiled Successfully");
        }
    });
}