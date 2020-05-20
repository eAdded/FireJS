import ConfigMapper, {Args, Config, getArgs} from "./mappers/ConfigMapper";
import PageArchitect from "./architects/PageArchitect"
import WebpackArchitect from "./architects/WebpackArchitect"
import PluginMapper from "./mappers/PluginMapper"
import BuildRegistrar from "./registrars/build.registrar"
import {readFileSync} from "fs";
import PathMapper from "./mappers/PathMapper";
import Cli from "./utils/Cli";
import MapComponent from "./classes/MapComponent";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {writeFileRecursively} from "./utils/Fs";
import StaticArchitect from "./architects/StaticArchitect";

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

export interface FireJS_MAP {
    externals: string[],
    pages: {
        [key: string]: ChunkGroup
    }
}

export interface $ {
    args?: Args,
    config?: Config,
    map?: Map<string, MapComponent>,
    cli?: Cli,
    webpackConfig?: WebpackConfig,
    template?: string,
    externals?: string[],
    rel?: PathRelatives
}

export interface Params {
    config?: Config,
    args?: Args,
    pages?: string[],
    webpackConfig?: WebpackConfig,
    template?: string,
}

export default class {
    private readonly $: $ = {externals: []};

    constructor(params: Params = {}) {
        this.$.args = params.args || getArgs();
        this.$.cli = new Cli(this.$.args);
        this.$.config = new ConfigMapper(this.$).getConfig(params.config);
        this.$.template = params.template || readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.pages ? new PathMapper(this.$).convertToMap(params.pages) : new PathMapper(this.$).map();
        this.$.webpackConfig = params.webpackConfig || new WebpackArchitect(this.$).readUserConfig();
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
    }

    mapPluginsAndBuildExternals() {
        const pageArchitect = new PageArchitect(this.$);
        const pluginMapper = new PluginMapper(this.$);
        this.$.cli.log("Mapping Plugins");
        pluginMapper.mapPlugins();
        this.$.cli.log("Building Externals");
        return pageArchitect.buildExternals()
    }

    //only build pages in production because server builds it in dev
    buildPro(callback) {
        if (!this.$.config.pro) {
            this.$.cli.error("Not in production mode. Make sure to pass [--pro, -p] flag")
            throw "";
        }
        const pluginMapper = new PluginMapper(this.$);
        const pageArchitect = new PageArchitect(this.$);
        const staticArchitect = new StaticArchitect(this.$);
        const promises = [];
        this.mapPluginsAndBuildExternals().then(() => {
            const buildRegistrar = new BuildRegistrar(this.$);
            this.$.cli.log("Building Pages");
            for (const mapComponent of this.$.map.values()) {
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent, () => {
                        buildRegistrar.registerForSemiBuild(mapComponent).then(() => {
                            pageArchitect.buildDirect(mapComponent, () => {
                                resolve();
                                this.$.cli.ok(`Successfully built page ${mapComponent.Page}`)
                                pluginMapper.applyPlugin(mapComponent, (pagePath) => {
                                    Promise.all([
                                        writeFileRecursively(//write content
                                            join(this.$.config.paths.dist, pagePath.MapPath),
                                            `window.__MAP__=${JSON.stringify(pagePath.Map)}`
                                        ),
                                        writeFileRecursively(//write html
                                            join(this.$.config.paths.dist, pagePath.Path.concat(".html")),
                                            staticArchitect.finalize(staticArchitect.render(mapComponent.chunkGroup, pagePath, true))
                                        )
                                    ]).then(resolve).catch(err => {
                                        throw err;
                                    })
                                });
                            }, err => {
                                throw err
                            });
                        }).catch(err => {
                            throw err
                        });
                    }, err => {
                        throw err
                    });
                }));
            }
            Promise.all(promises).then(callback);
        });
    }

    generateMap(): FireJS_MAP {
        const babel_map: FireJS_MAP = {
            externals: this.$.externals,
            pages: {}
        };
        for (const mapComponent of this.$.map.values())
            babel_map.pages[mapComponent.Page] = mapComponent.chunkGroup
        return babel_map;
    }

    get Context(): $ {
        return this.$;
    }
}