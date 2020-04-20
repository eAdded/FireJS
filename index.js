const _ = require("lodash");
const ConfigArchitect = require("./architects/config.architect");
const Mapper = require("./mappers/path.mapper")
const PageArchitect = require("./architects/page.architect");
const WebpackArchitect = require("./architects/webpack.architect");
const Cli = require("./utils/cli-color");

module.exports = class {
    #$ = {
        args: {},
        config: {},
        map: {},
        cli: {}
    };

    constructor({userConfig, config, args, map}) {
        const configArchitect = new ConfigArchitect(this.#$);
        this.#$.args = args || ConfigArchitect.getArgs();
        this.#$.cli = new Cli(this.#$.args);
        this.#$.config = config || configArchitect.getConfig(_.cloneDeep(userConfig));
        this.#$.map = map || new Mapper(this.#$).getMap();
    }

    newPageArchitect() {
        return new PageArchitect(this.#$);
    }
    newWebpackArchitect() {
        return new WebpackArchitect(this.#$);
    }
}