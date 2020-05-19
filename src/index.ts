import {cloneDeep} from "lodash";
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

export type WebpackConfig = Configuration;
export type WebpackStat = Stats;

export interface FireJS_MAP {
    externals: string[],
    pages: {
        [key: string]: {
            babelChunk: string,
            chunks: string[]
        }
    }
}

export interface $ {
    args?: Args,
    config?: Config,
    map?: Map<string, MapComponent>,
    cli?: Cli,
    webpackConfig?: WebpackConfig,
    template?: string,
    externals?: string[]
}

export interface Params {
    userConfig?: Config,
    config?: Config,
    args?: Args,
    pages?: string[],
    webpackConfig?: WebpackConfig,
    template?: string,
}

export default class {
    private readonly $: $ = {};

    constructor(params: Params = {}) {
        this.$.args = params.args || getArgs();
        this.$.cli = new Cli(this.$.args);
        this.$.config = params.config || params.userConfig ? new ConfigMapper(this.$).getConfig(cloneDeep(params.userConfig)) : new ConfigMapper(this.$).getConfig();
        this.$.template = params.template || readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.pages ? new PathMapper(this.$).convertToMap(params.pages) : new PathMapper(this.$).map();
        this.$.webpackConfig = params.webpackConfig || new WebpackArchitect(this.$).readUserConfig();
        this.$.externals = [];
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
                                pluginMapper.applyPlugin(mapComponent);
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
        for (const mapComponent of this.$.map.values()) {
            babel_map.pages[mapComponent.Page] = {
                babelChunk: mapComponent.babelChunk,
                chunks: mapComponent.chunks
            };
        }
        return babel_map;
    }

    get Context(): $ {
        return this.$;
    }
}