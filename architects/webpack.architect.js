const webpack = require("webpack");
const path = require("path")
const fs = require("fs");
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
        return {
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
    }

    readUserConfig() {
        // predefined object structure to prevent undefined error
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

    babel(conf) {
        let mergedConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            ..._.cloneDeep(conf || this.getConfigBase())
            //settings un-touchable by user
        };
        mergedConfig.output.filename = "[name][hash].js";
        mergedConfig.output.publicPath = `/${path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib)}/`;
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
                filename: "[name][hash].css",
            }),
        );
        const outs = [];

        for (const entry of this.#$.map.entries()) {
            const out = _.cloneDeep(mergedConfig)
            out.name = entry[0];
            out.entry[entry[1].getName()] = entry[1].getAbsolutePath();
            out.output.path = path.join(this.#$.config.paths.babel, entry[1].getDir());
            outs.push(out);
        }
        return outs;
    }

    direct(conf) {
        let mergedConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            watch: !this.#$.config.pro,
            ..._.cloneDeep(conf || this.getConfigBase()),
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
        mergedConfig.output.path = this.#$.config.paths.lib;
        mergedConfig.output.filename = `[name][hash].js`;
        mergedConfig.output.publicPath = `/${path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib)}/`;

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
        const outs = [];
        const web_front_entry = path.resolve(__dirname, this.#$.config.pro ? '../web/index_pro.js' : '../web/index_dev.js')

        for (const mapComponent of this.#$.map.values()) {
            const out = _.cloneDeep(mergedConfig);
            out.name = mapComponent.getPage();
            out.entry[mapComponent.getName()] = web_front_entry;
            out.plugins.push(
                new webpack.ProvidePlugin({
                    App: this.#$.config.pro ? path.join(this.#$.config.paths.babel, mapComponent.getDir(), mapComponent.babelChunk) : mapComponent.getAbsolutePath()
                }),
            );
            outs.push(out);
        }
        return outs;
    }
}