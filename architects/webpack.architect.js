const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path")
const {config} = require("../config/global.config")
const _ = require("lodash");
const {throwError} = require("../utils/cli-color");

/**
 * @return {{output: {}, entry: {}, plugins: [], module: {rules: []}}}
 */
function getUserConfig() {
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
        if (Array.isArray(userWebpack))
            userWebpack.forEach((prop) => {
                if (prop.name === ("web-" + config.name))
                    return {...sample, ...prop};
            })
        else if (typeof userWebpack === "object")
            return {
                ...sample,
                ...userWebpack
            }
        else
            throwError("Expected webpack config object or array got " + typeof userWebpack);
    }
    return sample;
}


/**
 * @param {String[]} pages array of pages
 * @returns {*[]}
 */
module.exports = (pages) => {
    return module.exports.withConfig(pages, getUserConfig())
};

/**
 *
 * @param {String[]} pages array of pages
 * @param {{output: {}, entry: {}, plugins: *[], module: {rules: *[]}}} conf webpack config
 * @param {String} conf webpack config
 * @return {[]}
 */
module.exports.withConfig = (pages, conf) => {
    if (!Array.isArray(pages))
        throwError("Expected array of pages got " + typeof pages);
    if (typeof conf !== "object")
        throwError(":( expected object got " + typeof conf);


    let mergedConfig = {
        //settings which can be changed by user
        target: 'web',
        mode: config.mode,
        ...conf,
        //settings un-changeable by user
        name: `web-${config.name}`,
    };

    if (!mergedConfig.output.path) mergedConfig.output.path = path.join(config.dist)
    if (!mergedConfig.output.filename) mergedConfig.output.filename = "[name].[hash].js"

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
    //mergedConfig.entry.shared.push('react','react-dom');//shared imports
    const outs = [];
    pages.forEach((page, index) => {
        outs.push(_.cloneDeep(mergedConfig));
        let relative = page.replace(config.pages + "/", "");
        let {dir, name} = path.parse(relative);
        const entry = path.join(dir, name);
        outs[index].entry[entry] = page;
        outs[index].plugins.push(new HtmlWebpackPlugin({
            filename: `${entry}.html`,
            template: path.resolve(__dirname, '../front/template.html'),
        }));
    });

    return outs;
}