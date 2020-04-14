const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path")
const globalDefaults = require("../config/global.config");
const config = require("../config/default.config")
const _ = require("lodash");

/**
 * @return {{output: {}, entry: {shared: []}, plugins: [], module: {rules: []}}}
 */
const userConfig = (function getUserConfig() {
    // predefined object structure to prevent undefined error
    const sample = {
        entry: {
          //  shared : []
        },
        output: {},
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
 * @param pages array of absolute paths to the pages
 * @returns {{mode: string, output: {path: string, filename: string}, entry: [string, *], plugins: [], module: {rules: []}, name: string, target: string}}
 */
module.exports = (pages) => {
    let mergedConfig = {
        //settings which can be changed by user
        target: 'web',
        mode: 'development',
        ..._.cloneDeep(userConfig),
        //settings un-changeable by user
        name: `web-${globalDefaults.name}`,
    };

    if (!mergedConfig.output.path) mergedConfig.output.path = path.join(globalDefaults.dist)
    if (!mergedConfig.output.filename) mergedConfig.output.filename = "[name].[hash].js"

    //mergedConfig.entry.shared.push('react','react-dom');//shared imports
    pages.forEach((page,index) => {
        let relative = page.replace(config.pages+"/","");
        let {dir,name,base} = path.parse(relative);
        const entry = path.join(dir,name);
        mergedConfig.entry[entry] = page;
        mergedConfig.plugins.push(new HtmlWebpackPlugin({
            filename: `${entry}.html`,
            template: 'front/template.html',
            chunks: [entry],
        }));
    });
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
    /*mergedConfig.plugins.push(
        new webpack.DefinePlugin({
            //  PAGE_SOURCE : `\"${pageAbsolutePath}\"`//add double quotes to represent string
            PAGE_SOURCE: `\"${page}\"`
        }));*/
    console.log(mergedConfig)
    return mergedConfig;
};