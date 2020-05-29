import {cloneDeep} from "lodash"
import {$, WebpackConfig} from "../FireJS";
import {join} from "path"
import Page from "../classes/Page";
import MiniCssExtractPlugin = require('mini-css-extract-plugin');

export default class {
    private readonly $: $;
    private readonly userConfig: WebpackConfig;

    constructor(globalData: $, userConfig: WebpackConfig = {}) {
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

    forExternals(): WebpackConfig {
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
                library: "[name]",//make file as library so it can be imported for static generation
            }
        };
    }

    forPage(page: Page): WebpackConfig {
        let mergedConfig: WebpackConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.$.config.pro ? "production" : "development",
            //add config base to user config to prevent undefined errors
            ...cloneDeep(this.userConfig),
            //settings un-touchable by user
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minChunks: Infinity
                },
                usedExports: true,
                minimize: true
            }
        };
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
            }
        );
        mergedConfig.plugins.push(
            new MiniCssExtractPlugin({
                filename: "c" + ((mergedConfig.output.chunkFilename + ".css") || "c[contentHash].css")
            }),
        );
        mergedConfig.name = page.toString()
        mergedConfig.entry = join(this.$.config.paths.pages, mergedConfig.name);
        mergedConfig.output.filename = "m" + ((mergedConfig.output.filename + ".js") || `m[contentHash].js`);
        mergedConfig.output.chunkFilename = "c" + ((mergedConfig.output.chunkFilename + ".js") || "c[contentHash].js");
        mergedConfig.output.publicPath = `/${this.$.rel.libRel}/`;
        mergedConfig.output.path = this.$.config.paths.lib;
        mergedConfig.output.library = "__FIREJS_APP__";
        mergedConfig.output.libraryTarget = "window";

        return mergedConfig;
    }
}