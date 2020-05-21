import ConfigMapper, {Args, Config, getArgs} from "./mappers/ConfigMapper";
import PageArchitect from "./architects/PageArchitect"
import WebpackArchitect from "./architects/WebpackArchitect"
import {applyPlugin, getPlugins, mapPlugins, resolveCustomPlugins} from "./mappers/PluginMapper"
import BuildRegistrar from "./registrars/build.registrar"
import {readFileSync} from "fs";
import PathMapper from "./mappers/PathMapper";
import Cli from "./utils/Cli";
import MapComponent from "./classes/MapComponent";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {writeFileRecursively} from "./utils/Fs";
import StaticArchitect, {DefaultArchitect, StaticConfig} from "./architects/StaticArchitect";
import PagePath from "./classes/PagePath";

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

export interface FIREJS_MAP {
    staticConfig: StaticConfig,
    pageMap: {
        [key: string]: ChunkGroup
    },
    template: string
}

export default class {
    private readonly $: $ = {externals: []};

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

    mapPluginsAndBuildExternals() {
        const pageArchitect = new PageArchitect(this.$);
        this.$.cli.log("Mapping Plugins");
        mapPlugins(this.$.config.plugins, this.$.map);
        this.$.cli.log("Building Externals");
        return pageArchitect.buildExternals()
    }

    //only build pages in production because server builds it in dev
    buildPro(callback) {
        if (!this.$.config.pro) {
            this.$.cli.error("Not in production mode. Make sure to pass [--pro, -p] flag")
            throw "";
        }
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
                                applyPlugin(mapComponent, this.$.rel, (pagePath) => {
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

    get Context(): $ {
        return this.$;
    }
}

export class CustomRenderer {
    readonly map: Map<string, MapComponent>
    readonly architect: DefaultArchitect;

    constructor(pathToBabelDir: string, pathToPluginsDir: string | undefined = undefined, customPlugins: string[] = [], rootDir: string = process.cwd()) {
        const firejs_map = JSON.parse(readFileSync(pathToBabelDir).toString());
        firejs_map.staticConfig.babelPath = pathToPluginsDir;
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
    }

    renderWithPluginData() {

    }

    render(page, path, content) {
        for (const page in this.map.pageMap) {
            this.architect.finalize(this.architect.render(this.map[page], new PagePath(, path,)))

        }
    }
}