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
        this.#$.config = config || userConfig ? this.newConfigMapper().getArgs(_.cloneDeep(userConfig)) : this.newConfigMapper().getConfig();
        this.#$.map = map || new PathMapper(this.#$).map();
        this.#$.webpackConfig = webpackConfig || this.newWebpackArchitect().readUserConfig();
    }

    getConfig(){
        return this.#$.config;
    }

    getWebpackConfig(){
        return this.#$.webpackConfig;
    }

    build() {
        this.newPageArchitect().autoBuild(()=>{
            new PluginDataMapper(this.#$).mapAndBuild();
        });
    }

    addPlugin(page,data){
        new PathArchitect(this.#$).build(page,data);
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