const webpack = require("webpack");
const webpackConfig = require("../config/web-webpack.config");
const basicConfig = require("../config/default.config")
const path = require("path")
/**
 * Creates webpackConfig according to page and passes to this(config)
 * @param {String[]} pages array of path to page
 */
module.exports = (pages) => {
    let pageConfigs = [];
    pages.forEach((page) => {
        pageConfigs.push(webpackConfig(path.join(basicConfig.src,"pages",page)));
    })
    console.log(pageConfigs.length)
    return fromConfig(pageConfigs);
}

/**
 * compiles page using webpack according to config
 * @param {Object[]} configs Array of webpack configuration
 */
function fromConfig(configs) {
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

module.exports.fromConfig = fromConfig;
