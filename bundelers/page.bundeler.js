const webpack = require("webpack");
const webpackConfig = require("../config/web-webpack.config");
/**
 * Creates webpackConfig according to page and passes to this(config)
 * @param {String} page path to page
 */
module.exports = (page = "") => {
    module.exports.fromConfig(webpackConfig(page))
}

/**
 * compiles page using webpack according to config
 * @param {Object} config webpack configuration
 */
module.exports.fromConfig = (config = {}) => {
    webpack(config, (err, stats) => {
        if (process.argv[2] === "v")
            console.log("Stats -> ", stats);
        if (err || stats.hasErrors() ) {
            console.error(stats);
            throw {err, stats: stats};
        } else {
            console.log("Compiled Successfully");
        }
    });
}