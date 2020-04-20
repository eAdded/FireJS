const GlobalConfig = require("./config/global.config");
const Mapper = require("./mappers/path.mapper")
const _ = require("lodash");
const pageArchitect = require("./architects/page.architect");
const webpackArchitect = require("./architects/webpack.architect");
const Cli = require("./utils/cli-color");
module.exports = class {
    #$ = {
        args: {},
        config: {},
        map: {},
        cli: {}
    };

    constructor({userConfig, config, args, map}) {
        const globalConfig = new GlobalConfig(this.#$);
        this.#$.args = args || GlobalConfig.getArgs();
        this.#$.cli = new Cli(this.#$.args);
        this.#$.config = config || globalConfig.getConfig(_.cloneDeep(userConfig));
        this.#$.map = map || new Mapper(this.#$).getMap();
    }

    newPageArchitect() {
        return new pageArchitect(this.#$);
    }
    newWebpackArchitect() {
        return new webpackArchitect(this.#$);
    }

}