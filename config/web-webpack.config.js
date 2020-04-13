const HtmlWebpackPlugin = require("html-webpack-plugin");
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
 * @param page Absolute path of the page
 * @returns {{mode: string, output: {path: string, filename: string}, entry: string, plugins: [], module: {rules: []}, name: string, target: string}}
 */
module.exports = (page) => {
    const parsedPagePath = path.parse(page);
    const mergedConfig = {
        ...userConfig,//first copy user config, then edit it
        name: parsedPagePath.name + globalDefaults.name,
        target: 'web',
        mode: 'development',
        entry: ['@babel/polyfill',page],
        output: {
            path: globalDefaults.dist,
            filename: `${parsedPagePath.name}.bundle.js`
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
            //  PAGE_SOURCE : `\"${pageAbsolutePath}\"`//add double quotes to represent string
            PAGE_SOURCE: `\"${page}\"`
        }),
        new HtmlWebpackPlugin({
            filename:  parsedPagePath.name+".html",
            template: 'front/template.html'
        }));
    return mergedConfig;
};