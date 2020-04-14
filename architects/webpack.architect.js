const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path")
const webpack = require("webpack")
const globalDefaults = require("../config/global.config");
const config = require("../config/default.config")
const _ = require("lodash");

const userConfig = (function getUserConfig() {
    // predefined object structure to prevent undefined error
    const sample = {
        entry: {},
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
 * @returns {{mode: string, output: {path: string, filename: string}, entry: [string, *], plugins: [], module: {rules: []}, name: string, target: string}}
 */
module.exports = (page) => {
    let relative = page.replace(config.pages+"/","");
    let {dir,name,base} = path.parse(relative);
    console.log(base,name,dir);
    let mergedConfig = {
        target: 'web',//placed on top to allow getting replaced by users config
        mode: 'development',
        ..._.cloneDeep(userConfig),//first copy user config, then edit it
        name: `${relative} ${globalDefaults.name}`,
        entry: ["@babel/polyfill", page],
        output: {
            publicPath : "/"+dir,
            path: path.join(globalDefaults.dist,dir),
            filename: `${name}.bundle.js`
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
            filename: name + ".html",
            template: 'front/template.html'
        }));
    return mergedConfig;
};