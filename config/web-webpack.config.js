const path = require("path")
const webpack = require("webpack")
const globalDefaults = require("./global.config");
const config = require("./default.config")

const userConfig = (function getUserConfig() {
    // predefined object structure to prevent undefined error
    const sample = {
        module: {
            rules: []
        },
        plugins: []
    }
    if (config.webpack) {
        const userWebpack = require(config.webpack);
        userWebpack.forEach((prop) => {
            if (prop.name === ("web-" + globalDefaults.name))
                return {...sample, ...prop};
        })
    }
    return sample;
})();

/**
 * @param {string} page path to page
 * @returns {{output: {path: (String|Promise<*>|string|Promise<void>|Promise<any>), filename: string}, entry: string, plugins: [], module: {rules: [{test: RegExp, use: {loader: string, options: {presets: [string, string]}}, exclude: string}]}, name: string, target: string}}
 */
module.exports = (page) => {
    const mergedConfig = {
        ...userConfig,//first copy user config, then edit it
        name: "web-" + globalDefaults.name,
        target: 'web',
        entry: path.resolve(__dirname,"../front/web-front.js"),
        output: {
            path: globalDefaults.dist,
            filename: "bundle.js"
        }
    };
    mergedConfig.module.rules.push({
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
            loader: 'babel-loader',
            options: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
            }
        }
    });
    mergedConfig.plugins.push(
        new webpack.DefinePlugin({
            PAGE_SOURCE : `\"${page}\"`//add double quotes to represent string
        })
    );
    return mergedConfig
};