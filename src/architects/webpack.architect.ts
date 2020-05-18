import webpack from "webpack"
import _ from "lodash"
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MapComponent from "../classes/MapComponent";
import {$} from "../index";

export default class {
    #$;

    constructor(globalData: $) {
        this.#$ = globalData;
    }

    externals = () => {
        return {
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            entry: {
                "React": "react",
                "ReactDOM": "react-dom",
                "ReactHelmet": "react-helmet"
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

    babel(mapComponent: MapComponent, user_config: any = {}) {
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
        mergedConfig.externals = [];
        mergedConfig.externals.push('react', 'react-dom', 'react-helmet');
        mergedConfig.name = mapComponent.Page;
        mergedConfig.output.publicPath = `/${path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib)}/`;
        mergedConfig.entry = path.join(this.#$.config.paths.pages, mapComponent.Page);
        mergedConfig.output.path = this.#$.config.paths.babel;
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

    direct(mapComponent: MapComponent, user_config: any = {}) {
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
            }
        };

        mergedConfig.externals.react = 'React';
        mergedConfig.externals["react-dom"] = "ReactDOM";
        mergedConfig.externals["react-helmet"] = "ReactHelmet";
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
        mergedConfig.name = mapComponent.Page;
        //path before file name is important cause it allows easy routing during development
        mergedConfig.output.filename = `m[contentHash].js`;
        mergedConfig.output.chunkFilename = "c[contentHash].js";
        mergedConfig.output.publicPath = `/${path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib)}/`;
        if (this.#$.config.pro) //only output in production because they'll be served from memory in dev mode
            mergedConfig.output.path = this.#$.config.paths.lib;
        else
            mergedConfig.output.path = "/";//in dev the content is served from memory
        mergedConfig.entry = web_front_entry;
        mergedConfig.plugins.push(
            new webpack.ProvidePlugin({
                App: this.#$.config.pro ? path.join(this.#$.config.paths.babel, mapComponent.babelChunk) : path.join(this.#$.config.paths.pages, mapComponent.Page)
            }),
        );
        return mergedConfig;
    }
}