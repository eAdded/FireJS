import _ from "lodash";
import ConfigMapper from "./mappers/ConfigMapper";
import PageArchitect from "./architects/PageArchitect"
import WebpackArchitect from "./architects/WebpackArchitect"
import PluginMapper from "./mappers/PluginMapper"
import BuildRegistrar from "./registrars/build.registrar"
import {join} from "path"
import {readFileSync} from "fs";
import PathMapper from "./mappers/PathMapper";
import Cli from "./utils/Cli";

export interface $ {
    args: any,
    config: any,
    map: any,
    externals: string[],
    cli: Cli,
    webpackConfig: any,
    template: string,
}

module.exports = class {

    $: $;

    constructor({userConfig, config, args, map, webpackConfig, template}) {
        this.$.args = args || ConfigMapper.getArgs();
        this.$.cli = new Cli(this.$.args);
        this.$.config = config || userConfig ? new ConfigMapper(this.$).getConfig(_.cloneDeep(userConfig)) : new ConfigMapper(this.$).getConfig();
        this.$.template = template || readFileSync(join(__dirname, 'web/template.html')).toString();
        this.$.map = map ? new PathMapper(this.$).convertToMap(map) : new PathMapper(this.$).map();
        this.$.webpackConfig = webpackConfig || new WebpackArchitect(this.$).readUserConfig();
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
                                this.$.cli.ok(`Successfully built page ${mapComponent.getPage()}`)
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