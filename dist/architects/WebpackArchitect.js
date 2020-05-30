"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path_1 = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
class default_1 {
    constructor(globalData, userConfig = {}) {
        this.$ = globalData;
        userConfig.entry = userConfig.entry || {};
        userConfig.output = userConfig.output || {};
        // @ts-ignore
        userConfig.module = userConfig.module || {};
        userConfig.module.rules = userConfig.module.rules || [];
        userConfig.externals = userConfig.externals || {};
        userConfig.plugins = userConfig.plugins || [];
        this.userConfig = userConfig;
    }
    forExternals() {
        return {
            target: 'web',
            mode: this.$.config.pro ? "production" : "development",
            entry: {
                "React": "react",
                "ReactDOM": "react-dom",
                "ReactHelmet": "react-helmet",
            },
            output: {
                path: this.$.config.paths.lib,
                filename: "e[contentHash].js",
                library: "[name]",
            }
        };
    }
    forPage(page) {
        let mergedConfig = Object.assign(Object.assign({ 
            //settings which can be changed by user
            target: 'web', mode: this.$.config.pro ? "production" : "development" }, lodash_1.cloneDeep(this.userConfig)), { 
            //settings un-touchable by user
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minChunks: Infinity
                },
                usedExports: true,
                minimize: true
            } });
        mergedConfig.externals["react"] = 'React';
        mergedConfig.externals["react-dom"] = "ReactDOM";
        mergedConfig.externals["react-helmet"] = "ReactHelmet";
        const cssLoaderUse = [MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        hashPrefix: 'hash',
                    },
                },
            }
        ];
        mergedConfig.module.rules.push({
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react"]
                }
            },
        }, {
            test: /\.sass$/i,
            loader: [...cssLoaderUse, 'sass-loader']
        }, {
            test: /\.less$/i,
            loader: [...cssLoaderUse, 'less-loader']
        }, {
            test: /\.css$/i,
            use: cssLoaderUse
        });
        mergedConfig.plugins.push(new MiniCssExtractPlugin({
            filename: "c" + (mergedConfig.output.chunkFilename || "[contentHash]") + ".css"
        }));
        mergedConfig.name = page.toString();
        mergedConfig.entry = path_1.join(this.$.config.paths.pages, mergedConfig.name);
        mergedConfig.output.filename = "m" + (mergedConfig.output.filename || "[contentHash]") + ".js";
        mergedConfig.output.chunkFilename = "c" + (mergedConfig.output.chunkFilename || "[contentHash]") + ".js";
        mergedConfig.output.publicPath = `/${this.$.rel.libRel}/`;
        mergedConfig.output.path = this.$.config.paths.lib;
        mergedConfig.output.library = "__FIREJS_APP__";
        mergedConfig.output.libraryTarget = "window";
        return mergedConfig;
    }
}
exports.default = default_1;
