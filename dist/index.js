"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
const PluginMapper_1 = require("./mappers/PluginMapper");
const build_registrar_1 = require("./registrars/build.registrar");
const fs_1 = require("fs");
const PathMapper_1 = require("./mappers/PathMapper");
const Cli_1 = require("./utils/Cli");
const path_1 = require("path");
const Fs_1 = require("./utils/Fs");
const StaticArchitect_1 = require("./architects/StaticArchitect");
class default_1 {
    constructor(params = {}) {
        this.$ = { externals: [] };
        this.$.args = params.args || ConfigMapper_1.getArgs();
        this.$.cli = new Cli_1.default(this.$.args);
        this.$.config = new ConfigMapper_1.default(this.$.cli, this.$.args).getConfig(params.config || new ConfigMapper_1.default(this.$.cli, this.$.args).getUserConfig());
        this.$.template = params.template || fs_1.readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.pages ? new PathMapper_1.default(this.$).convertToMap(params.pages) : new PathMapper_1.default(this.$).map();
        this.$.webpackConfig = params.webpackConfig || new WebpackArchitect_1.default(this.$).readUserConfig();
        this.$.rel = {
            libRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.map)
        };
    }
    mapPluginsAndBuildExternals() {
        const pageArchitect = new PageArchitect_1.default(this.$);
        this.$.cli.log("Mapping Plugins");
        PluginMapper_1.mapPlugins(this.$.config.plugins, this.$.map);
        this.$.cli.log("Building Externals");
        return pageArchitect.buildExternals();
    }
    //only build pages in production because server builds it in dev
    buildPro(callback) {
        if (!this.$.config.pro) {
            this.$.cli.error("Not in production mode. Make sure to pass [--pro, -p] flag");
            throw "";
        }
        const pageArchitect = new PageArchitect_1.default(this.$);
        const staticArchitect = new StaticArchitect_1.default(this.$);
        const promises = [];
        this.mapPluginsAndBuildExternals().then(() => {
            const buildRegistrar = new build_registrar_1.default(this.$);
            this.$.cli.log("Building Pages");
            for (const mapComponent of this.$.map.values()) {
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent, () => {
                        buildRegistrar.registerForSemiBuild(mapComponent).then(() => {
                            pageArchitect.buildDirect(mapComponent, () => {
                                resolve();
                                this.$.cli.ok(`Successfully built page ${mapComponent.Page}`);
                                PluginMapper_1.applyPlugin(mapComponent, this.$.rel, (pagePath) => {
                                    Promise.all([
                                        Fs_1.writeFileRecursively(//write content
                                        path_1.join(this.$.config.paths.dist, pagePath.MapPath), `window.__MAP__=${JSON.stringify(pagePath.Map)}`),
                                        Fs_1.writeFileRecursively(//write html
                                        path_1.join(this.$.config.paths.dist, pagePath.Path.concat(".html")), staticArchitect.finalize(staticArchitect.render(mapComponent.chunkGroup, pagePath, true)))
                                    ]).then(resolve).catch(err => {
                                        throw err;
                                    });
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
            }
            Promise.all(promises).then(callback);
        });
    }
    generateMap() {
        const babel_map = {
            externals: this.$.externals,
            pages: {}
        };
        for (const mapComponent of this.$.map.values())
            babel_map.pages[mapComponent.Page] = mapComponent.chunkGroup;
        return babel_map;
    }
    get Context() {
        return this.$;
    }
}
exports.default = default_1;
class foo {
    constructor(config, pathToPlugins, otherPlugins = [], rootDir) {
        this.config = config;
        this.plugins = PluginMapper_1.getPlugins(pathToPlugins);
        PluginMapper_1.checkOtherPlugins(otherPlugins, rootDir);
        this.plugins.push(...otherPlugins);
    }
    renderPath() {
    }
}
exports.foo = foo;
