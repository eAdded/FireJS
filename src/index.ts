import ConfigMapper, {Args, Config, getArgs} from "./mappers/ConfigMapper";
import WebpackArchitect from "./architects/WebpackArchitect"
import PathMapper from "./mappers/PathMapper";
import Cli from "./utils/Cli";
import MapComponent from "./classes/Page";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import StaticArchitect, {DefaultArchitect, StaticConfig} from "./architects/StaticArchitect";
import {mapPlugins} from "./mappers/PluginMapper";
import PageArchitect from "./architects/PageArchitect";
import {moveChunks, writeFileRecursively} from "./utils/Fs";

export type WebpackConfig = Configuration;
export type WebpackStat = Stats;

export interface PathRelatives {
    libRel: string,
    mapRel: string
}

export interface ChunkGroup {
    babelChunk: string,
    chunks: string[]
}

export interface $ {
    args?: Args,
    config?: Config,
    pageMap?: Map<string, MapComponent>,
    cli?: Cli,
    webpackConfig?: WebpackConfig,
    template?: string,
    rel?: PathRelatives
}

export interface Params {
    config?: Config,
    args?: Args,
    pages?: string[],
    webpackConfig?: WebpackConfig,
    template?: string,
}

export interface FIREJS_MAP {
    staticConfig: StaticConfig,
    pageMap: {
        [key: string]: ChunkGroup
    },
    template: string
}

export default class {
    private readonly $: $ = {};

    constructor(params: Params = {}) {
        this.$.args = params.args || getArgs();
        this.$.cli = new Cli(this.$.args);
        this.$.config = new ConfigMapper(this.$.cli, this.$.args).getConfig(params.config);
        this.$.template = params.template || readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.pages ? new PathMapper(this.$).convertToMap(params.pages) : new PathMapper(this.$).map();
        this.$.webpackConfig = params.webpackConfig || new WebpackArchitect(this.$).readUserConfig();
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
    }

    buildPro() {
        return new Promise<any>((resolve, reject) => {
            if (!this.$.config.pro)
                throw new Error("Not in production mode. Make sure to pass [--pro, -p] flag");
            const pageArchitect = new PageArchitect(this.$);
            const staticArchitect = new StaticArchitect(this.$);
            this.$.cli.log("Mapping Plugins");
            if (!this.$.args["--disable-plugins"])
                if (this.$.config.paths.plugins)
                    mapPlugins(this.$.config.paths.plugins, this.$.pageMap);
                else
                    throw new Error("Plugins Dir Not found")

            this.$.cli.log("Building Externals");
            new PageArchitect(this.$)
                .buildExternals()
                .then(_ => {
                    this.$.cli.log("Building Pages");
                    const promises = [];
                    for (const page of this.$.pageMap.values())
                        promises.push(new Promise(resolve => {
                            pageArchitect.buildBabel(page, () => {
                                moveChunks(page, this.$).then(() => {
                                    pageArchitect.buildDirect(page, () => {
                                        this.$.cli.ok(`Successfully built page ${page.getName()}`)
                                        page.plugin.getPaths().then(paths => {
                                            paths.forEach(path => {
                                                page.plugin.getContent(path)
                                                    .then(content => {
                                                        Promise.all([
                                                            writeFileRecursively(`${path}.map.json`, JSON.stringify({
                                                                content,
                                                                chunks: page.chunkGroup.chunks
                                                            })),
                                                            writeFileRecursively(`${path}.map.html`,
                                                                staticArchitect.finalize(staticArchitect.render(this.$.template, page.chunkGroup, path, true))
                                                            )
                                                        ]).then(resolve).catch(err => {
                                                            throw err;
                                                        })
                                                    }).catch(err => {
                                                    throw err;
                                                })
                                            })
                                        }).catch(err => {
                                            throw err;
                                        })
                                    }, err => {
                                        throw err;
                                    })
                                }).catch(err => {
                                    throw err;
                                })
                            }, err => {
                                throw err;
                            })
                        }))
                })
        })
    }


    getContext(): $ {
        return this.$;
    }
}


export class CustomRenderer {
    readonly map: Map<string, MapComponent> = new Map()
    readonly architect: DefaultArchitect;
    readonly template: string;
    readonly rel: PathRelatives;

    constructor(pathToBabelDir: string, pathToPluginsDir: string | undefined = undefined, customPlugins: string[] = [], rootDir: string = process.cwd()) {
        const firejs_map: FIREJS_MAP = JSON.parse(readFileSync(join(pathToBabelDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.babelPath = join(rootDir, pathToBabelDir);
        this.template = firejs_map.template;
        this.rel = firejs_map.staticConfig.rel
        this.architect = new DefaultArchitect(firejs_map.staticConfig);
        for (const page in firejs_map.pageMap) {
            const mapComponent = new MapComponent(page);
            mapComponent.chunkGroup = firejs_map.pageMap[page];
            this.map.set(page, mapComponent);
        }
        let plugins;
        if (pathToPluginsDir) {
            plugins = getPlugins(pathToPluginsDir);
            plugins.push(...resolveCustomPlugins(customPlugins, rootDir));
        } else//prevent unnecessary copy
            plugins = resolveCustomPlugins(customPlugins, rootDir);
        mapPlugins(plugins, this.map);
        addDefaultPlugins(this.map);
    }

    renderWithPluginData(mapComponent: MapComponent, path: string, callback) {
        // @ts-ignore
        if (!mapComponent.paths) {
            applyPlugin(mapComponent, this.rel, (pagePath, index) => {
                // @ts-ignore
                mapComponent.plugin[index] = undefined;
                if (mapComponent. == mapComponent.plugin.length) {//render when all paths are gained
                    // @ts-ignore
                    mapComponent.wasApplied = true;
                    this.renderWithPluginData(mapComponent, path, callback);
                }
            })
        } else {
            let pagePath;
            if (!mapComponent.paths.some(p => {
                if (p.Path === path) {
                    pagePath = p;
                    return true
                } else
                    return false
            }))
                throw "path not found"
            callback(this.architect.finalize(
                this.architect.render(this.template, mapComponent.chunkGroup, pagePath, true)));
        }
    }

    render(page: string, path: string, content: any) {
        const mapComponent = this.map.get(page);
        return this.architect.finalize(
            this.architect.render(this.template, mapComponent.chunkGroup, new PagePath(mapComponent, path, content, this.rel), true));
    }
}