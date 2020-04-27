const _ = require("lodash");
const ConfigMapper = require("./mappers/config.mapper");
const PathMapper = require("./mappers/path.mapper")
const PageArchitect = require("./architects/page.architect");
const WebpackArchitect = require("./architects/webpack.architect");
const Cli = require("./utils/cli-color");
const PluginDataMapper = require("./mappers/pluginData.mapper");
const PathArchitect = require("./architects/path.architect");
const BuildRegistrar = require("./registrars/build.registrar");
const _path = require("path");
const fs = require("fs");
module.exports = class {

    #$ = {
        args: {},
        config: {},
        map: new Map(),
        cli: {},
        webpackConfig: {},
        template: "",
    };

    constructor({userConfig, config, args, map, webpackConfig, template}) {
        this.#$.args = args || ConfigMapper.getArgs();
        this.#$.cli = new Cli(this.#$.args);
        this.#$.config = config || userConfig ? this.newConfigMapper().getConfig(_.cloneDeep(userConfig)) : this.newConfigMapper().getConfig();
        this.#$.template = template || fs.readFileSync(_path.join(__dirname, 'web/template.html')).toString();
        this.#$.map = map ? new PathMapper().convertToMap(map) : new PathMapper(this.#$).map();
        this.#$.webpackConfig = webpackConfig || this.newWebpackArchitect().readUserConfig();
    }

    getConfig() {
        return this.#$.config;
    }

    getWebpackConfig() {
        return this.#$.webpackConfig;
    }

    build() {
        new BuildRegistrar(this.#$).autoRegister();//register for copy chunks on semi build
        new PluginDataMapper(this.#$).map().then(r => {}).catch(e=>{throw e});
        new PageArchitect(this.#$).autoBuild()
            .then(r => this.#$.cli.ok("Completed initial build cycle"))
            .catch(reason => {
                this.#$.cli.error("Error during first build cycle");
                throw reason
            });
    }

    /*applyPlugin(page, paths, template) {
        new PluginDataMapper(this.#$).(page, paths, template, new PathArchitect(this.#$));
    }*/

    newPathArchitect() {
        return new PathArchitect(this.#$);
    }

    newWebpackArchitect() {
        return new WebpackArchitect(this.#$);
    }

    newConfigMapper() {
        return new ConfigMapper(this.#$);
    }
}