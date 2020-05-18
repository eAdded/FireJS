"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
const PluginMapper_1 = require("./mappers/PluginMapper");
const build_registrar_1 = require("./registrars/build.registrar");
const fs_1 = require("fs");
const PathMapper_1 = require("./mappers/PathMapper");
const Cli_1 = require("./utils/Cli");
class default_1 {
    constructor(params = {}) {
        this.$ = {};
        this.$.args = params.args || ConfigMapper_1.getArgs();
        this.$.cli = new Cli_1.default(this.$.args);
        this.$.config = params.config || params.userConfig ? new ConfigMapper_1.default(this.$).getConfig(lodash_1.cloneDeep(params.userConfig)) : new ConfigMapper_1.default(this.$).getConfig();
        this.$.template = params.template || fs_1.readFileSync(this.$.config.paths.template).toString();
        this.$.map = params.map ? new PathMapper_1.default(this.$).convertToMap(params.map) : new PathMapper_1.default(this.$).map();
        this.$.webpackConfig = params.webpackConfig || new WebpackArchitect_1.default(this.$).readUserConfig();
        this.$.externals = [];
    }
    mapPluginsAndBuildExternals() {
        const pageArchitect = new PageArchitect_1.default(this.$);
        const pluginMapper = new PluginMapper_1.default(this.$);
        this.$.cli.log("Mapping Plugins");
        pluginMapper.mapPlugins();
        this.$.cli.log("Building Externals");
        return pageArchitect.buildExternals();
    }
    //only build pages in production because server builds it in dev
    buildPro(callback) {
        const pluginMapper = new PluginMapper_1.default(this.$);
        const pageArchitect = new PageArchitect_1.default(this.$);
        const promises = [];
        this.mapPluginsAndBuildExternals().then((_) => {
            const buildRegistrar = new build_registrar_1.default(this.$);
            this.$.cli.log("Building Pages");
            for (const mapComponent of this.$.map.values()) {
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent, () => {
                        buildRegistrar.registerForSemiBuild(mapComponent).then(() => {
                            pageArchitect.buildDirect(mapComponent, () => {
                                resolve();
                                this.$.cli.ok(`Successfully built page ${mapComponent.Page}`);
                                pluginMapper.applyPlugin(mapComponent);
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
            Promise.all(promises).then(() => callback());
        });
    }
    getContext() {
        return this.$;
    }
}
exports.default = default_1;
