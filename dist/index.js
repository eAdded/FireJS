"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
const PluginMapper_1 = require("./mappers/PluginMapper");
const fs_1 = require("fs");
const PathMapper_1 = require("./mappers/PathMapper");
const Cli_1 = require("./utils/Cli");
const Page_1 = require("./classes/Page");
const path_1 = require("path");
const Fs_1 = require("./utils/Fs");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const Path_1 = require("./classes/Path");
class default_1 {
    constructor(params = {}) {
        this.$ = { externals: [] };
        this.$.args = params.args || ConfigMapper_1.getArgs();
        this.$.cli = new Cli_1.default(this.$.args);
        this.$.config = new ConfigMapper_1.default(this.$.cli, this.$.args).getConfig(params.config);
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
        PluginMapper_1.addDefaultPlugins(this.$.map);
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
            this.$.cli.log("Building Pages");
            for (const mapComponent of this.$.map.values()) {
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent, () => {
                        Fs_1.moveChunks(mapComponent, this.$).then(() => {
                            pageArchitect.buildDirect(mapComponent, () => {
                                resolve();
                                this.$.cli.ok(`Successfully built page ${mapComponent.Page}`);
                                PluginMapper_1.applyPlugin(mapComponent, this.$.rel, (pagePath) => {
                                    Promise.all([
                                        Fs_1.writeFileRecursively(//write content
                                        path_1.join(this.$.config.paths.dist, pagePath.MapPath), `window.__MAP__=${JSON.stringify(pagePath.Map)}`),
                                        Fs_1.writeFileRecursively(//write html
                                        path_1.join(this.$.config.paths.dist, pagePath.Path.concat(".html")), staticArchitect.finalize(staticArchitect.render(this.$.template, mapComponent.chunkGroup, pagePath, true)))
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
    get Context() {
        return this.$;
    }
}
exports.default = default_1;
class CustomRenderer {
    constructor(pathToBabelDir, pathToPluginsDir = undefined, customPlugins = [], rootDir = process.cwd()) {
        this.map = new Map();
        const firejs_map = JSON.parse(fs_1.readFileSync(path_1.join(pathToBabelDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.babelPath = path_1.join(rootDir, pathToBabelDir);
        this.template = firejs_map.template;
        this.rel = firejs_map.staticConfig.rel;
        this.architect = new StaticArchitect_1.DefaultArchitect(firejs_map.staticConfig);
        for (const page in firejs_map.pageMap) {
            const mapComponent = new Page_1.default(page);
            mapComponent.chunkGroup = firejs_map.pageMap[page];
            this.map.set(page, mapComponent);
        }
        let plugins;
        if (pathToPluginsDir) {
            plugins = PluginMapper_1.getPlugins(pathToPluginsDir);
            plugins.push(...PluginMapper_1.resolveCustomPlugins(customPlugins, rootDir));
        }
        else //prevent unnecessary copy
            plugins = PluginMapper_1.resolveCustomPlugins(customPlugins, rootDir);
        PluginMapper_1.mapPlugins(plugins, this.map);
        PluginMapper_1.addDefaultPlugins(this.map);
    }
    renderWithPluginData(mapComponent, path, callback) {
        // @ts-ignore
        if (!mapComponent.wasApplied) {
            let counter = 0;
            PluginMapper_1.applyPlugin(mapComponent, this.rel, _ => {
                // @ts-ignore
                if (++counter == mapComponent.plugin.length) { //render when all paths are gained
                    // @ts-ignore
                    mapComponent.wasApplied = true;
                    this.renderWithPluginData(mapComponent, path, callback);
                }
            });
        }
        else {
            let pagePath;
            if (!mapComponent.paths.some(p => {
                if (p.Path === path) {
                    pagePath = p;
                    return true;
                }
                else
                    return false;
            }))
                throw "path not found";
            callback(this.architect.finalize(this.architect.render(this.template, mapComponent.chunkGroup, pagePath, true)));
        }
    }
    render(page, path, content) {
        const mapComponent = this.map.get(page);
        return this.architect.finalize(this.architect.render(this.template, mapComponent.chunkGroup, new Path_1.default(mapComponent, path, content, this.rel), true));
    }
}
exports.CustomRenderer = CustomRenderer;
