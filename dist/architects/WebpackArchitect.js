"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const lodash_1 = require("lodash");
const path_1 = require("path");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    externals() {
        return {
            target: 'web',
            mode: this.$.config.pro ? "production" : "development",
            entry: {
                "React": "react",
                "ReactDOM": "react-dom",
                "ReactHelmet": "react-helmet"
            },
            output: {
                path: this.$.config.paths.lib,
                filename: "[name][contentHash].js",
                library: "[name]",
            }
        };
    }
    getConfigBase() {
        // predefined object structure to prevent undefined error
        return {
            entry: {},
            output: {},
            module: {
                rules: []
            },
            plugins: [],
            externals: {}
        };
    }
    readUserConfig() {
        const sample = this.getConfigBase();
        if (this.$.config.paths.webpack) {
            const userWebpack = require(this.$.config.paths.webpack);
            if (typeof userWebpack === "object")
                return Object.assign(Object.assign({}, sample), userWebpack);
            else {
                this.$.cli.error("Expected WebpackConfig Types [object] got" + typeof userWebpack);
                throw new Error();
            }
        }
        return sample;
    }
    babel(mapComponent, user_config) {
        let mergedConfig = Object.assign(Object.assign({ 
            //settings which can be changed by user
            target: 'web', mode: this.$.config.pro ? "production" : "development" }, lodash_1.cloneDeep(Object.assign(Object.assign({}, this.getConfigBase()), user_config))), { 
            //settings un-touchable by user
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minChunks: Infinity
                },
                usedExports: true,
                minimize: true
            } });
        mergedConfig.externals = [];
        mergedConfig.externals.push('react', 'react-dom', 'react-helmet');
        mergedConfig.name = mapComponent.Page;
        mergedConfig.output.publicPath = `/${path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib)}/`;
        mergedConfig.entry = path_1.join(this.$.config.paths.pages, mapComponent.Page);
        mergedConfig.output.path = this.$.config.paths.babel;
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.globalObject = "this";
        mergedConfig.output.libraryTarget = "commonjs2"; //make file as library so it can be imported for static generation
        mergedConfig.module.rules.push({
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react"]
                }
            },
        }, {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            hashPrefix: 'hash',
                        },
                    },
                }
            ],
        });
        mergedConfig.plugins.push(new MiniCssExtractPlugin({
            filename: "c[contentHash].css"
        }));
        return mergedConfig;
    }
    direct(mapComponent, user_config) {
        let mergedConfig = Object.assign(Object.assign({ 
            //settings which can be changed by user
            target: 'web', mode: this.$.config.pro ? "production" : "development", watch: !this.$.config.pro }, lodash_1.cloneDeep(Object.assign(Object.assign({}, this.getConfigBase()), user_config))), { 
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
        if (!this.$.config.pro) {
            mergedConfig.module.rules.push({
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                },
            });
            mergedConfig.module.rules.push({
                test: /\.css$/i,
                use: ['style-loader', {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                hashPrefix: 'hash',
                            },
                        },
                    }],
            });
        }
        const web_front_entry = path_1.resolve(__dirname, this.$.config.pro ? '../../web/index_pro.js' : '../../web/index_dev.js');
        mergedConfig.name = mapComponent.Page;
        //path before file name is important cause it allows easy routing during development
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.publicPath = `/${path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib)}/`;
        if (this.$.config.pro) //only output in production because they'll be served from memory in dev mode
            mergedConfig.output.path = this.$.config.paths.lib;
        else
            mergedConfig.output.path = "/"; //in dev the content is served from memory
        mergedConfig.entry = web_front_entry;
        mergedConfig.plugins.push(new webpack.ProvidePlugin({
            App: this.$.config.pro ? path_1.join(this.$.config.paths.babel, mapComponent.chunkGroup.babelChunk) : path_1.join(this.$.config.paths.pages, mapComponent.Page)
        }));
        return mergedConfig;
    }
}
exports.default = default_1;
