const _ = require("lodash");
const ConfigMapper = require("./mappers/config.mapper");
const PathMapper = require("./mappers/path.mapper")
const PageArchitect = require("./architects/page.architect");
const WebpackArchitect = require("./architects/webpack.architect");
const Cli = require("./utils/cli-color");
const PluginDataMapper = require("./mappers/pluginData.mapper");
const PathArchitect = require("./architects/path.architect");
module.exports = class {

    #$ = {
        args: {},
        config: {},
        map: {},
        cli: {},
        webpackConfig: {}
    };

    constructor({userConfig, config, args, map, webpackConfig}) {
        this.#$.args = args || ConfigMapper.getArgs();
        this.#$.cli = new Cli(this.#$.args);
        this.#$.config = config || userConfig ? this.newConfigMapper().getConfig(_.cloneDeep(userConfig)) : this.newConfigMapper().getConfig();
        this.#$.map = map ? new PathMapper().convertToMap(map) : new PathMapper(this.#$).map();
        this.#$.webpackConfig = webpackConfig || this.newWebpackArchitect().readUserConfig();
    }

    getConfig() {
        return this.#$.config;
    }

    getWebpackConfig() {
        return this.#$.webpackConfig;
    }

    build(callback) {
        this.newPageArchitect().autoBuild(() => {
            if (!this.#$.config.noPlugin)
                new PluginDataMapper(this.#$).mapAndBuild();
            callback();
        });
    }

    getTemplate() {
        return new PathArchitect(this.#$).readTemplate();
    }

    buildPage(page, paths, template) {
        new PluginDataMapper(this.#$).applyPlugin(page, paths, template, new PathArchitect(this.#$));
    }

    newPageArchitect() {
        return new PageArchitect(this.#$);
    }

    newWebpackArchitect() {
        return new WebpackArchitect(this.#$);
    }

    newConfigMapper() {
        return new ConfigMapper(this.#$);
    }
}