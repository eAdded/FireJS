import ConfigMapper, {Args, Config, getArgs} from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import PageArchitect from "./architects/PageArchitect";
import {moveChunks, writeFileRecursively} from "./utils/Fs";
import * as fs from "fs"
import StaticArchitect, {StaticConfig} from "./architects/StaticArchitect";
import {convertToMap, createMap} from "./mappers/PathMapper";
import WebpackArchitect from "./architects/WebpackArchitect";


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
    pageMap?: Map<string, Page>,
    cli?: Cli,
    template?: string,
    rel?: PathRelatives,
    outputFileSystem?,
    inputFileSystem?,
    renderer?: StaticArchitect,
    pageArchitect?
    PageArchitect?
}

export interface Params {
    config?: Config,
    args?: Args,
    pages?: string[],
    template?: string,
    webpackConfig?: WebpackConfig
    outputFileSystem?,
    inputFileSystem?
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
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.args = params.args || getArgs();
        this.$.cli = new Cli(this.$.args["--plain"] ? "--plain" : this.$.args["--silent"] ? "--silent" : undefined);
        this.$.config = new ConfigMapper(this.$.cli, this.$.args).getConfig(params.config);
        this.$.template = params.template || this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString();
        this.$.pageMap = params.pages ? convertToMap(params.pages) : createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
        this.$.cli.log("Mapping Plugins");
        if (!this.$.args["--disable-plugins"])
            if (this.$.config.paths.plugins)
                mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
            else
                throw new Error("Plugins Dir Not found")
        this.$.pageArchitect = new PageArchitect(this.$, new WebpackArchitect(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
        this.$.cli.log("Building Externals");
        this.$.pageArchitect.buildExternals().then(externals => {
            this.$.renderer = new StaticArchitect({
                rel: this.$.rel,
                babelPath: this.$.config.paths.babel,
                externals,
                explicitPages: this.$.config.pages,
                tags: this.$.config.templateTags,
            })
        });
    }

    buildPro() {
        return new Promise<any>((resolve, reject) => {
                if (!this.$.config.pro)
                    throw new Error("Not in production mode. Make sure to pass [--pro, -p] flag");
                this.$.cli.log("Building Pages");
                const promises = [];
                for (const page of this.$.pageMap.values())
                    promises.push(new Promise(resolve => {
                        this.$.pageArchitect.buildBabel(page, () => {
                            moveChunks(page, this.$, this.$.outputFileSystem).then(() => {
                                this.$.pageArchitect.buildDirect(page, () => {
                                    this.$.cli.ok(`Successfully built page ${page.toString()}`)
                                    page.plugin.getPaths().then(paths => {
                                        paths.forEach(path => {
                                            page.plugin.getContent(path)
                                                .then(content => {
                                                    Promise.all([
                                                        writeFileRecursively(join(this.$.config.paths.map, `${path}.map.json`), JSON.stringify({
                                                            content,
                                                            chunks: page.chunkGroup.chunks
                                                        }), this.$.outputFileSystem),
                                                        writeFileRecursively(join(this.$.config.paths.dist, `${path}.map.html`),
                                                            this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, true)),
                                                            this.$.outputFileSystem
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
                Promise.all(promises).then(resolve).catch(reject);
            }
        )
    }

    getContext()
        :
        $ {
        return this.$;
    }
}

/*

export class CustomRenderer {
    readonly map: Map<string, Page> = new Map()
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
}*/
