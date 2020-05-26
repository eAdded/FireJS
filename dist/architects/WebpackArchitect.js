"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path_1 = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
class default_1 {
    constructor(globalData, userConfig = {}) {
        this.$ = globalData;
        const userWebpack = userConfig || (this.$.config.paths.webpack ? require(this.$.config.paths.webpack) : {});
        if (typeof userWebpack === "object")
            this.userConfig = Object.assign({ entry: {}, output: {}, module: {
                    rules: []
                }, externals: {}, plugins: [] }, userWebpack);
        else
            throw new Error("Expected WebpackConfig Types [object] got" + typeof userWebpack);
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
                path: this.$.config.pro ? this.$.config.paths.lib : `/${this.$.rel.libRel}`,
                filename: "e[contentHash].js",
                library: "[name]",
            }
        };
    }
    forPage(page) {
        let mergedConfig = Object.assign(Object.assign({ 
            //settings which can be changed by user
            target: 'web', mode: this.$.config.pro ? "production" : "development", watch: !this.$.config.pro }, lodash_1.cloneDeep(this.userConfig)), { 
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
        mergedConfig.name = page.toString();
        mergedConfig.entry = path_1.join(this.$.config.paths.pages, mergedConfig.name);
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.publicPath = `/${this.$.rel.libRel}/`;
        mergedConfig.output.path = this.$.config.pro ? this.$.config.paths.lib : mergedConfig.output.publicPath;
        mergedConfig.output.library = "__FIREJS_APP__";
        mergedConfig.output.libraryTarget = "window";
        return mergedConfig;
    }
}
exports.default = default_1;
