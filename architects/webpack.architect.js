const webpack = require("webpack");
const path = require("path")
const _ = require("lodash");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    externals = () => {
        return {
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            entry: {
                "React": "react",
                "ReactDOM": "react-dom"
            },
            output: {
                path: this.#$.config.paths.lib,
                filename: "[name][contentHash].js",
                library: "[name]",//make file as library so it can be imported for static generation
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
        }
    }

    readUserConfig() {
        const sample = this.getConfigBase();
        if (this.#$.config.paths.webpack) {
            const userWebpack = require(this.#$.config.paths.webpack);
            if (Array.isArray(userWebpack))
                userWebpack.forEach((prop) => {
                    if (prop.name === ("web-" + this.#$.config.name))
                        return {...sample, ...prop};
                })
            else if (typeof userWebpack === "object")
                return {
                    ...sample,
                    ...userWebpack
                }
            else {
                this.#$.cli.error("Expected webpack config object or array got " + typeof userWebpack)
                throw new Error();
            }
        }
        return sample;
    }

    babel(mapComponent, user_config) {
        let mergedConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            //add config base to user config to prevent undefined errors
            ..._.cloneDeep({...this.getConfigBase(), ...user_config} || this.#$.webpackConfig),
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
        mergedConfig.name = mapComponent.getPage();
        mergedConfig.output.publicPath = `/${path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib)}/`;
        mergedConfig.entry = path.join(this.#$.config.paths.pages, mapComponent.getPage());
        mergedConfig.output.path = this.#$.config.paths.babel;
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.globalObject = "this";
        mergedConfig.output.libraryTarget = "commonjs2" //make file as library so it can be imported for static generation
        mergedConfig.externals.React = "React";
        mergedConfig.externals.ReactDOM = "ReactDOM";
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

    direct(mapComponent, user_config) {
        let mergedConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            watch: !this.#$.config.pro,
            //add config base to user config to prevent undefined errors
            ..._.cloneDeep({...this.getConfigBase(), ...user_config} || this.#$.webpackConfig),
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

        mergedConfig.externals.React = "React";
        mergedConfig.externals.ReactDOM = "ReactDOM";

        if (!this.#$.config.pro) {
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
        const web_front_entry = path.resolve(__dirname, this.#$.config.pro ? '../web/index_pro.js' : '../web/index_dev.js')
        mergedConfig.name = mapComponent.getPage();
        //path before file name is important cause it allows easy routing during development
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        if (this.#$.config.pro) {//only output in production because they'll be served from memory in dev mode
            mergedConfig.output.path = this.#$.config.paths.lib;
        }
        mergedConfig.entry = web_front_entry;
        mergedConfig.plugins.push(
            new webpack.ProvidePlugin({
                App: this.#$.config.pro ? path.join(this.#$.config.paths.babel, mapComponent.babelChunk) : path.join(this.#$.config.paths.pages, mapComponent.getPage())
            }),
        );
        return mergedConfig;
    }
}