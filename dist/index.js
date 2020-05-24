"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const Cli_1 = require("./utils/Cli");
const path_1 = require("path");
const PluginMapper_1 = require("./mappers/PluginMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const Fs_1 = require("./utils/Fs");
const fs = require("fs");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const PathMapper_1 = require("./mappers/PathMapper");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
class default_1 {
    constructor(params = {}) {
        this.$ = {};
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.args = params.args || ConfigMapper_1.getArgs();
        this.$.cli = new Cli_1.default(this.$.args["--plain"] ? "--plain" : this.$.args["--silent"] ? "--silent" : undefined);
        this.$.config = new ConfigMapper_1.default(this.$.cli, this.$.args).getConfig(params.config);
        this.$.template = params.template || this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString();
        this.$.pageMap = params.pages ? PathMapper_1.convertToMap(params.pages) : PathMapper_1.createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.map)
        };
        this.$.cli.log("Mapping Plugins");
        if (!this.$.args["--disable-plugins"])
            if (this.$.config.paths.plugins)
                PluginMapper_1.mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
            else
                throw new Error("Plugins Dir Not found");
        this.$.pageArchitect = new PageArchitect_1.default(this.$, new WebpackArchitect_1.default(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
        this.$.cli.log("Building Externals");
        this.$.pageArchitect.buildExternals().then(externals => {
            this.$.renderer = new StaticArchitect_1.default({
                rel: this.$.rel,
                babelPath: this.$.config.paths.babel,
                externals,
                explicitPages: this.$.config.pages,
                tags: this.$.config.templateTags,
            });
        });
    }
    buildPro() {
        return new Promise((resolve, reject) => {
            if (!this.$.config.pro)
                throw new Error("Not in production mode. Make sure to pass [--pro, -p] flag");
            this.$.cli.log("Building Pages");
            const promises = [];
            for (const page of this.$.pageMap.values())
                promises.push(new Promise(resolve => {
                    this.$.pageArchitect.buildBabel(page, () => {
                        Fs_1.moveChunks(page, this.$, this.$.outputFileSystem).then(() => {
                            this.$.pageArchitect.buildDirect(page, () => {
                                this.$.cli.ok(`Successfully built page ${page.toString()}`);
                                page.plugin.getPaths().then(paths => {
                                    paths.forEach(path => {
                                        page.plugin.getContent(path)
                                            .then(content => {
                                            Promise.all([
                                                Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.map, `${path}.map.json`), JSON.stringify({
                                                    content,
                                                    chunks: page.chunkGroup.chunks
                                                }), this.$.outputFileSystem),
                                                Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.dist, `${path}.map.html`), this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, true)), this.$.outputFileSystem)
                                            ]).then(resolve).catch(err => {
                                                throw err;
                                            });
                                        }).catch(err => {
                                            throw err;
                                        });
                                    });
                                }).catch(err => {
                                    throw err;
                                });
                            }, err => {
                                throw err;
                            });
                        }).catch(err => {
                            throw err;
                        });
                    }, err => {
                        throw err;
                    });
                }));
            Promise.all(promises).then(resolve).catch(reject);
        });
    }
    getContext() {
        return this.$;
    }
}
exports.default = default_1;
