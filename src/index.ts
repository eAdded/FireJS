import {cloneDeep} from "lodash";
import ConfigMapper from "./mappers/ConfigMapper";
import PageArchitect from "./architects/PageArchitect"
import WebpackArchitect from "./architects/WebpackArchitect"
import PluginMapper from "./mappers/PluginMapper"
import BuildRegistrar from "./registrars/build.registrar"
import {readFileSync} from "fs";
import PathMapper from "./mappers/PathMapper";
import Cli from "./utils/Cli";

export interface $ {
    args?: any,
    config?: any,
    map?: any,
    cli?: Cli,
    webpackConfig?: any,
    template?: string,
    externals?: string[]
}

export interface params {
    userConfig?: any,
    config?: any,
    args?: any,
    map?: any,
    webpackConfig?: any,
    template?: string,
}

export default class {
    private readonly $: $ = {};

    constructor(params: params = {}) {
        this.$.args = params.args || ConfigMapper.getArgs();
        this.$.cli = new Cli(this.$.args);
        this.$.config = params.config || params.userConfig ? new ConfigMapper(this.$).getConfig(cloneDeep(params.userConfig)) : new ConfigMapper(this.$).getConfig();
        this.$.template = params.template || readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.map ? new PathMapper(this.$).convertToMap(params.map) : new PathMapper(this.$).map();
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
        const pluginMapper = new PluginMapper(this.$);
        const pageArchitect = new PageArchitect(this.$);
        const promises = [];
        this.mapPluginsAndBuildExternals().then((_) => {
            const buildRegistrar = new BuildRegistrar(this.$);
            this.$.cli.log("Building Pages");
            for (const mapComponent of this.$.map.values())
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent, _ => {
                        buildRegistrar.registerForSemiBuild(mapComponent).then(_ => {
                            pageArchitect.buildDirect(mapComponent, _ => {
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
            Promise.all(promises).then(_ => callback());
        });
    }

    getContext() {
        return this.$;
    }
}