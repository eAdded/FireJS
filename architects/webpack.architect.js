const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path")
const fs = require("fs");
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
        plugins: [],
        externals: {}
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

function smartBuildLib() {
    if (!fs.existsSync(path.join(config.dist, "React.js")) || !fs.existsSync(path.join(config.dist, "ReactDOM.js")))
        return buildReactConfig();
    else
        return undefined;
}

function buildReactConfig() {
    return {
        target: 'web',
        mode: config.mode,
        entry: {
            "React": "react",
            "ReactDOM": "react-dom"
        },
        output: {
            path: config.dist,
            filename: "[name].js",
            library: "[name]",
        }
    };
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
        //settings un-touchable by user
        optimization: {
            splitChunks: {
                chunks: 'all',
                minChunks: Infinity
            },
            usedExports: true
        },
    };

    if (config.mode === "production") {
        mergedConfig.watch = false;
        mergedConfig.output.path = config.cache;
    } else {
        mergedConfig.watch = true;
        mergedConfig.output.path = config.dist;
        mergedConfig.externals.ReactDOM = "ReactDOM";
    }
    mergedConfig.output.filename = mergedConfig.output.filename || "[name].[hash].js"

    mergedConfig.externals.React = "React";

    mergedConfig.module.rules.push({
        test: /\.js$/,
        include: module.src,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ["@babel/preset-react"]
            }
        },
    });

    const outs = [];
    pages.forEach((page, index) => {
        let relative = page.replace(config.pages + "/", "");
        let {dir, name} = path.parse(relative);
        const entry = path.join(dir, name);
        if (mergedConfig.watch) {
            outs.push(_.cloneDeep(mergedConfig));
            outs[index].entry[entry] = path.resolve(__dirname, '../front/web-front.js');
            outs[index].plugins.push(
                new HtmlWebpackPlugin({
                    filename: `${entry}.html`,
                    template: path.resolve(__dirname, '../front/template.html'),
                }),
                new webpack.ProvidePlugin({
                    App: "react",
                })
            );
        } else {
            mergedConfig.target = 'node';
            mergedConfig.entry[entry] = page;//create in one config
            //make file as library so it can be imported for static generation
            mergedConfig.output.libraryTarget = "commonjs2"
        }
    });
    if (!mergedConfig.watch) {//if in production
        outs.push(mergedConfig);
    }
    const libs = smartBuildLib();
    if (libs)
        outs.push(libs);
    console.log(outs)
    return outs;
}