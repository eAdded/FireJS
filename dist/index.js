"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
const PathMapper_1 = require("./mappers/PathMapper");
const Cli_1 = require("./utils/Cli");
const Page_1 = require("./classes/Page");
const path_1 = require("path");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const PluginMapper_1 = require("./mappers/PluginMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const Fs_1 = require("./utils/Fs");
class default_1 {
    constructor(params = {}) {
        this.$ = {};
        this.$.args = params.args || ConfigMapper_1.getArgs();
        this.$.cli = new Cli_1.default(this.$.args);
        this.$.config = new ConfigMapper_1.default(this.$.cli, this.$.args).getConfig(params.config);
        this.$.template = params.template || readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.pages ? new PathMapper_1.default(this.$).convertToMap(params.pages) : new PathMapper_1.default(this.$).map();
        this.$.webpackConfig = params.webpackConfig || new WebpackArchitect_1.default(this.$).readUserConfig();
        this.$.rel = {
            libRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.map)
        };
    }
    buildPro() {
        return new Promise((resolve, reject) => {
            if (!this.$.config.pro)
                throw new Error("Not in production mode. Make sure to pass [--pro, -p] flag");
            const pageArchitect = new PageArchitect_1.default(this.$);
            const staticArchitect = new StaticArchitect_1.default(this.$);
            this.$.cli.log("Mapping Plugins");
            if (!this.$.args["--disable-plugins"])
                if (this.$.config.paths.plugins)
                    PluginMapper_1.mapPlugins(this.$.config.paths.plugins, this.$.pageMap);
                else
                    throw new Error("Plugins Dir Not found");
            this.$.cli.log("Building Externals");
            new PageArchitect_1.default(this.$)
                .buildExternals()
                .then(_ => {
                this.$.cli.log("Building Pages");
                const promises = [];
                for (const page of this.$.pageMap.values())
                    promises.push(new Promise(resolve => {
                        pageArchitect.buildBabel(page, () => {
                            Fs_1.moveChunks(page, this.$).then(() => {
                                pageArchitect.buildDirect(page, () => {
                                    this.$.cli.ok(`Successfully built page ${page.getName()}`);
                                    page.plugin.getPaths().then(paths => {
                                        paths.forEach(path => {
                                            page.plugin.getContent(path)
                                                .then(content => {
                                                Promise.all([
                                                    Fs_1.writeFileRecursively(`${path}.map.json`, JSON.stringify({
                                                        content,
                                                        chunks: page.chunkGroup.chunks
                                                    })),
                                                    Fs_1.writeFileRecursively(`${path}.map.html`, staticArchitect.finalize(staticArchitect.render(this.$.template, page.chunkGroup, path, true)))
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
            });
        });
    }
    getContext() {
        return this.$;
    }
}
exports.default = default_1;
class CustomRenderer {
    constructor(pathToBabelDir, pathToPluginsDir = undefined, customPlugins = [], rootDir = process.cwd()) {
        this.map = new Map();
        const firejs_map = JSON.parse(readFileSync(path_1.join(pathToBabelDir, "firejs.map.json")).toString());
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
            plugins = getPlugins(pathToPluginsDir);
            plugins.push(...resolveCustomPlugins(customPlugins, rootDir));
        }
        else //prevent unnecessary copy
            plugins = resolveCustomPlugins(customPlugins, rootDir);
        PluginMapper_1.mapPlugins(plugins, this.map);
        addDefaultPlugins(this.map);
    }
    renderWithPluginData(mapComponent, path, callback) {
        // @ts-ignore
        if (!mapComponent.paths) {
            applyPlugin(mapComponent, this.rel, (pagePath, index) => {
                // @ts-ignore
                mapComponent.plugin[index] = undefined;
                if (mapComponent. == mapComponent.plugin.length) { //render when all paths are gained
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
        return this.architect.finalize(this.architect.render(this.template, mapComponent.chunkGroup, new PagePath(mapComponent, path, content, this.rel), true));
    }
}
exports.CustomRenderer = CustomRenderer;
