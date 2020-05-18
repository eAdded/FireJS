"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
const PluginMapper_1 = require("./mappers/PluginMapper");
const build_registrar_1 = require("./registrars/build.registrar");
const path_1 = require("path");
const fs_1 = require("fs");
const PathMapper_1 = require("./mappers/PathMapper");
const Cli_1 = require("./utils/Cli");
module.exports = class {
    constructor({ userConfig, config, args, map, webpackConfig, template }) {
        this.$.args = args || ConfigMapper_1.default.getArgs();
        this.$.cli = new Cli_1.default(this.$.args);
        this.$.config = config || userConfig ? new ConfigMapper_1.default(this.$).getConfig(lodash_1.default.cloneDeep(userConfig)) : new ConfigMapper_1.default(this.$).getConfig();
        this.$.template = template || fs_1.readFileSync(path_1.join(__dirname, 'web/template.html')).toString();
        this.$.map = map ? new PathMapper_1.default(this.$).convertToMap(map) : new PathMapper_1.default(this.$).map();
        this.$.webpackConfig = webpackConfig || new WebpackArchitect_1.default(this.$).readUserConfig();
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
            for (const mapComponent of this.$.map.values())
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent, _ => {
                        buildRegistrar.registerForSemiBuild(mapComponent).then(_ => {
                            pageArchitect.buildDirect(mapComponent, _ => {
                                resolve();
                                this.$.cli.ok(`Successfully built page ${mapComponent.getPage()}`);
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
            Promise.all(promises).then(_ => callback());
        });
    }
    getContext() {
        return this.$;
    }
};
