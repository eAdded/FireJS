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
        this.#$.map = map ? new PathMapper(this.#$).convertToMap(map) : new PathMapper(this.#$).map();
        this.#$.webpackConfig = webpackConfig || this.newWebpackArchitect().readUserConfig();
    }

    middleware(req, res, next) {

    }

    build() {
        return new Promise((resolve, reject) => {
            const buildRegistrar = new BuildRegistrar(this.#$);
            buildRegistrar.registerForSemiBuild();//register for copy chunks on semi build
            new PluginDataMapper(this.#$).map();
            buildRegistrar.registerComponentForBuild();
            new PageArchitect(this.#$).autoBuild().then(() => {
                resolve();
            }).catch(reject);
        })
    }

    geCli() {
        return this.#$.cli;
    }

    getMap() {
        return this.#$.map;
    }

    getConfig() {
        return this.#$.config;
    }

    getWebpackConfig() {
        return this.#$.webpackConfig;
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