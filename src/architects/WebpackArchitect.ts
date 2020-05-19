import webpack = require("webpack");
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import {cloneDeep} from "lodash"
import MapComponent from "../classes/MapComponent";
import {$, WebpackConfig} from "../index";
import {join, relative, resolve} from "path"

export default class {
    private readonly $: $;

    constructor(globalData: $) {
        this.$ = globalData;
    }

    externals(): WebpackConfig {
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
                library: "[name]",//make file as library so it can be imported for static generation
            }
        };
    }

    getConfigBase(): WebpackConfig {
        // predefined object structure to prevent undefined error
        return {
            entry: {},
            output: {},
            module: {
                rules: []
            },
            plugins: [],
            externals: {}
        }

    }

    readUserConfig(): WebpackConfig {
        const sample = this.getConfigBase();
        if (this.$.config.paths.webpack) {
            const userWebpack = require(this.$.config.paths.webpack);
            if (typeof userWebpack === "object")
                return {
                    ...sample,
                    ...userWebpack
                }
            else {
                this.$.cli.error("Expected WebpackConfig Types [object] got" + typeof userWebpack)
                throw new Error();
            }
        }
        return sample;
    }

    babel(mapComponent: MapComponent, user_config: WebpackConfig): WebpackConfig {
        let mergedConfig: WebpackConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.$.config.pro ? "production" : "development",
            //add config base to user config to prevent undefined errors
            ...cloneDeep({...this.getConfigBase(), ...user_config}),
            //settings un-touchable by user
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minChunks: Infinity
                },
                usedExports: true,
                minimize: true
            },
        };
        mergedConfig.externals = [];
        mergedConfig.externals.push('react', 'react-dom', 'react-helmet');
        mergedConfig.name = mapComponent.Page;
        mergedConfig.output.publicPath = `/${relative(this.$.config.paths.dist, this.$.config.paths.lib)}/`;
        mergedConfig.entry = join(this.$.config.paths.pages, mapComponent.Page);
        mergedConfig.output.path = this.$.config.paths.babel;
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.globalObject = "this";
        mergedConfig.output.libraryTarget = "commonjs2" //make file as library so it can be imported for static generation
        mergedConfig.module.rules.push({
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                },
            },
            {
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
                filename: "c[contentHash].css"
            }),
        );
        return mergedConfig;
    }

    direct(mapComponent: MapComponent, user_config: WebpackConfig): WebpackConfig {
        let mergedConfig: WebpackConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.$.config.pro ? "production" : "development",
            watch: !this.$.config.pro,
            //add config base to user config to prevent undefined errors
            ...cloneDeep({...this.getConfigBase(), ...user_config}),
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
            mergedConfig.module.rules.push(
                {
                    test: /\.css$/i,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                hashPrefix: 'hash',
                            },
                        },
                    }],
                }
            );
        }
        const web_front_entry = resolve(__dirname, this.$.config.pro ? '../../web/index_pro.js' : '../../web/index_dev.js')
        mergedConfig.name = mapComponent.Page;
        //path before file name is important cause it allows easy routing during development
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.publicPath = `/${relative(this.$.config.paths.dist, this.$.config.paths.lib)}/`;
        if (this.$.config.pro) //only output in production because they'll be served from memory in dev mode
            mergedConfig.output.path = this.$.config.paths.lib;
        else
            mergedConfig.output.path = "/";//in dev the content is served from memory
        mergedConfig.entry = web_front_entry;
        mergedConfig.plugins.push(
            new webpack.ProvidePlugin({
                App: this.$.config.pro ? join(this.$.config.paths.babel, mapComponent.babelChunk) : join(this.$.config.paths.pages, mapComponent.Page)
            }),
        );
        return mergedConfig;
    }
}