import {cloneDeep} from "lodash"
import {$, WebpackConfig} from "../FireJS";
import {join, relative} from "path"
import Page from "../classes/Page";
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

export default class {
    private readonly $: $;
    public readonly defaultConfig: WebpackConfig;

    constructor($: $) {
        this.$ = $;
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
            mode: process.env.NODE_ENV as "development" | "production" | "none",
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
                            cacheDirectory: join(this.$.config.paths.cache, ".babelCache"),
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
        }
    }

    forExternals(): WebpackConfig {
        const conf: WebpackConfig = {
            target: 'web',
            mode: process.env.NODE_ENV as "development" | "production" | "none",
            entry: {
                "e": join(__dirname, "../../web/external_group_semi.js"),
                "r": join(__dirname, "../../web/renderer.js"),
            },
            output: {
                path: this.$.config.paths.lib,
                filename: "[name][contentHash].js"
            }
        };
        conf.entry[join(relative(this.$.config.paths.lib, this.$.config.paths.cache), "f")] = join(__dirname, "../../web/external_group_full.js");
        return conf;
    }

    forPage(page: Page): WebpackConfig {
        const mergedConfig = cloneDeep(this.defaultConfig);
        mergedConfig.name = page.toString()
        mergedConfig.entry = join(this.$.config.paths.pages, mergedConfig.name);
        page.plugin.initWebpack(mergedConfig);
        return mergedConfig;
    }
}