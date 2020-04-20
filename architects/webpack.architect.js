const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path")
const fs = require("fs");
const _ = require("lodash");
const cli = require("../utils/cli-color");

module.exports = class {
    module.exports
}


/**
 * @return {{mode: string, output: {path: string, filename: string, library: string}, entry: {ReactDOM: string, React: string}, target: string}|undefined}
 */
function smartBuildLib() {
    if (!fs.existsSync(path.join(paths.dist, "React.js")) || !fs.existsSync(path.join(paths.dist, "ReactDOM.js")))
        return buildReactConfig();
    else
        return undefined;
}

/**
 * @return {{mode: string, output: {path: string, filename: string, library: string}, entry: {ReactDOM: string, React: string}, target: string}}
 */
function buildReactConfig() {
    return {
        target: 'web',
        mode: config.pro ? "production" : "development",
        entry: {
            "React": "react",
            "ReactDOM": "react-dom"
        },
        output: {
            path: paths.dist,
            filename: "[name].js",
            library: "[name]",
        }
    };
}

const getUserConfig = () => {
    // predefined object structure to prevent undefined error
    console.log(require("../store/global.data"))
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
    if (paths.webpack) {
        const userWebpack = require(paths.webpack);
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
        else{
            cli.error("Expected webpack config object or array got "+typeof userWebpack)
            throw new Error();
        }
    }
    return sample;
}
module.exports.getUserConfig = getUserConfig;
/**
 *
 * @param {{output: {}, entry: {}, plugins: *[], module: {rules: *[]}}} conf webpack config
 * @param {String} conf webpack config
 * @return {[]}
 */
module.exports.babel = (conf) => {
    let mergedConfig = {
        //settings which can be changed by user
        target: 'web',
        mode: config.pro ? "production" : "development",
        ..._.cloneDeep(conf)
        //settings un-touchable by user
        //settings un-touchable by user
    };
    mergedConfig.output.path = mergedConfig.output.path || paths.cache;
    mergedConfig.output.filename = mergedConfig.output.filename || "[name].js"
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
    Object.keys(map).forEach(page => {
        mergedConfig.target = 'node';
        mergedConfig.entry[page] = path.join(paths.pages, page);//create in one config
        //make file as library so it can be imported for static generation
        mergedConfig.output.libraryTarget = "commonjs2"
    });
    console.log("babel",mergedConfig);
    return [mergedConfig];
}

module.exports.direct = (conf) => {
    let mergedConfig = {
        //settings which can be changed by user
        target: 'web',
        mode: config.pro ? "production" : "development",
        watch: !config.pro,
        ..._.cloneDeep(conf),
        //settings un-touchable by user
        optimization: {
            splitChunks: {
                chunks: 'all',
                minChunks: Infinity
            },
            usedExports: true
        },
    };
    mergedConfig.output.path = paths.dist;
    mergedConfig.output.filename = mergedConfig.output.filename || "[name].[hash].js"

    mergedConfig.externals.React = "React";
    mergedConfig.externals.ReactDOM = "ReactDOM";

    if (!config.pro)
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
    const web_front_entry = path.resolve(__dirname, '../web/index.js')
    const template = path.resolve(__dirname, '../web/template.html');
    Object.keys(map).forEach(page => {
        const out = _.cloneDeep(mergedConfig);
        out.entry[page] = web_front_entry;
        out.plugins.push(
            new HtmlWebpackPlugin({
                filename: `${page}.html`,
                template: template,
            }),
            new webpack.ProvidePlugin({
                App: path.join(config.pro ? paths.cache : paths.pages, page)
            })
        );
        outs.push(out);
    });
    const libs = smartBuildLib();
    if (libs)
        outs.push(libs);
    return outs;
}