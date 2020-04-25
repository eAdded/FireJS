const webpack = require("webpack");
const path = require("path")
const fs = require("fs");
const _ = require("lodash");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    #smartBuildLib = () => {
        if (!fs.existsSync(path.join(this.#$.config.paths.dist, "React.js")) || !fs.existsSync(path.join(this.#$.config.paths.dist, "ReactDOM.js")))
            return this.#buildReactConfig();
        else
            return undefined;
    }

    #buildReactConfig = () => {
        return {
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            entry: {
                "React": "react",
                "ReactDOM": "react-dom"
            },
            output: {
                path: this.#$.config.paths.lib,
                filename: "[name].js",
                library: "[name]",
            }
        };
    }

    readUserConfig() {
        // predefined object structure to prevent undefined error
        const sample = {
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
            ..._.cloneDeep(conf)
            //settings un-touchable by user
        };
        mergedConfig.output.path = mergedConfig.output.path || this.#$.config.paths.babel;
        mergedConfig.output.filename = mergedConfig.output.filename || "[name]"
        mergedConfig.externals.React = "React";
        mergedConfig.module.rules.push({
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react"]
                }
            },
        });
        const outs = [];
        Object.keys(this.#$.map).forEach(page => {
            mergedConfig.target = 'node';
            mergedConfig.entry[page] = path.join(this.#$.config.paths.pages, page);//create in one config
            //make file as library so it can be imported for static generation
            mergedConfig.output.libraryTarget = "commonjs2"
            outs.push(_.cloneDeep(mergedConfig));
        });
        return outs;
    }

    direct(conf) {
        let mergedConfig = {
            //settings which can be changed by user
            target: 'web',
            mode: this.#$.config.pro ? "production" : "development",
            watch: !this.#$.config.pro,
            ..._.cloneDeep(conf),
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
        mergedConfig.output.filename = mergedConfig.output.filename || "[name].js"

        mergedConfig.externals.React = "React";
        mergedConfig.externals.ReactDOM = "ReactDOM";

        if (!this.#$.config.pro)
            mergedConfig.module.rules.push({
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                },
            });

        const outs = [];
        const web_front_entry = path.resolve(__dirname, this.#$.config.pro ? '../web/index_pro.js' : '../web/index_dev.js')
        Object.keys(this.#$.map).forEach(page => {
            const out = _.cloneDeep(mergedConfig);
            out.entry[page] = web_front_entry;
            out.plugins.push(
                new webpack.ProvidePlugin({
                    App: path.join(this.#$.config.pro ? this.#$.config.paths.babel : this.#$.config.paths.pages, page)
                }),
            );
            outs.push(out);
        });
        const libs = this.#smartBuildLib();
        if (libs)
            outs.push(libs);
        return outs;
    }
}