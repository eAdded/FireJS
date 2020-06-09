"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path_1 = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
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
        this.defaultConfig = {
            target: 'web',
            mode: process.env.NODE_ENV,
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minChunks: Infinity
                },
                usedExports: true,
                minimize: true
            },
            entry: {},
            output: {
                filename: "m[contentHash].js",
                chunkFilename: "c[contentHash].js",
                publicPath: `/${this.$.rel.libRel}/`,
                path: this.$.config.paths.lib,
                library: "__FIREJS_APP__",
                libraryTarget: "window"
            },
            module: {
                rules: [{
                        test: /\.(js|jsx)$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: path_1.join(this.$.config.paths.cache, ".babelCache"),
                                presets: ["@babel/preset-env", "@babel/preset-react"]
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
                    }]
            },
            externals: {
                react: "React",
                "react-dom": 'ReactDOM'
            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: "c[contentHash].css"
                }),
                new CleanObsoleteChunks()
            ]
        };
    }
    forExternals() {
        const conf = {
            target: 'web',
            mode: process.env.NODE_ENV,
            entry: {
                "e": path_1.join(__dirname, "../../web/external_group_semi.js"),
                "r": path_1.join(__dirname, "../../web/renderer.js"),
            },
            output: {
                path: this.$.config.paths.lib,
                filename: "[name][contentHash].js"
            }
        };
        conf.entry[path_1.join(path_1.relative(this.$.config.paths.lib, this.$.config.paths.cache), "f")] = path_1.join(__dirname, "../../web/external_group_full.js");
        return conf;
    }
    forPage(page) {
        const mergedConfig = lodash_1.cloneDeep(this.defaultConfig);
        mergedConfig.name = page.toString();
        mergedConfig.entry = path_1.join(this.$.config.paths.pages, mergedConfig.name);
        page.plugin.configWebpack(mergedConfig);
        return mergedConfig;
    }
}
exports.default = default_1;
