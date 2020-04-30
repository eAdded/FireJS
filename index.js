const _ = require("lodash");
const ConfigMapper = require("./mappers/config.mapper");
const PathMapper = require("./mappers/path.mapper")
const PageArchitect = require("./architects/page.architect");
const WebpackArchitect = require("./architects/webpack.architect");
const Cli = require("./utils/cli-color");
const PluginDataMapper = require("./mappers/plugin.mapper");
const PathArchitect = require("./architects/path.architect");
const BuildRegistrar = require("./registrars/build.registrar");
const StaticArchitect = require("./architects/static.architect");
const _path = require("path");
const fs = require("fs");
module.exports = class {

    #$ = {
        args: {},
        config: {},
        map: new Map(),
        externals: [],
        cli: {},
        webpackConfig: {},
        template: "",
    };

    constructor({userConfig, config, args, map, webpackConfig, template}) {
        this.#$.args = args || ConfigMapper.getArgs();
        this.#$.cli = new Cli(this.#$.args);
        this.#$.config = config || userConfig ? new ConfigMapper(this.#$).getConfig(_.cloneDeep(userConfig)) : new ConfigMapper(this.#$).getConfig();
        this.#$.template = template || fs.readFileSync(_path.join(__dirname, 'web/template.html')).toString();
        this.#$.map = map ? new PathMapper(this.#$).convertToMap(map) : new PathMapper(this.#$).map();
        this.#$.webpackConfig = webpackConfig || new WebpackArchitect(this.#$).readUserConfig();
    }

    build() {
        const buildRegistrar = new BuildRegistrar(this.#$);
        const pageArchitect = new PageArchitect(this.#$);
     //   new PluginDataMapper(this.#$).mapPlugins();
        pageArchitect.buildExternals();
        for (const mapComponent of this.#$.map.values()) {
            if (this.#$.config.pro)
                pageArchitect.buildBabel(mapComponent).then(_ => {
                    buildRegistrar.registerForSemiBuild(mapComponent).then(_ => {
                        pageArchitect.buildDirect(mapComponent).then(_ => {
                            buildRegistrar.registerComponentForBuild(mapComponent).then(_ => {
                                console.log("Done page " + mapComponent.getPage());
                            }).catch(err => {throw err});
                        }).catch(err => {throw err})
                    }).catch(err => {throw err})
                }).catch(err => {throw err})
            else {
                pageArchitect.buildDirect(mapComponent).then(_ => {
                    console.log("Done page" + mapComponent.getPage());
                }).catch(er=>{console.log(er)})
            }
        }
    }

    getContext() {
        return this.#$;
    }

}