const globalConfig = require("./config/global.config");
const _ = require("lodash");
const pageArchitect = require("./architects/page.architect");
const webpackArchitect = require("./architects/webpack.architect");
const globalData = require("./store/global.data");
module.exports = class {
    #$ = new globalData();

    constructor({userConfig, config, args, map}) {
        this.#$.args = args || globalConfig.getArgs();
        this.#$.config = config || globalConfig.getConfig(_.cloneDeep(userConfig));
        this.#$.map = map || require("./mappers/path.mapper").getMap();
    }

    pageArchitect: new pageArchitect(this);
    webpackArchitect: new webpackArchitect(this);

}
module.exports.init = () => {

    return {

    };
}
