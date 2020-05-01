const _ = require("lodash");
const ConfigMapper = require("./mappers/config.mapper");
const PathMapper = require("./mappers/path.mapper")
const PageArchitect = require("./architects/page.architect");
const WebpackArchitect = require("./architects/webpack.architect");
const Cli = require("./utils/cli-color");
const PluginMapper = require("./mappers/plugin.mapper");
const BuildRegistrar = require("./registrars/build.registrar");
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

    mapPluginsAndBuildExternals() {
        const pageArchitect = new PageArchitect(this.#$);
        const pluginMapper = new PluginMapper(this.#$);
        this.#$.cli.log("Mapping Plugins");
        pluginMapper.mapPlugins();
        this.#$.cli.log("Building Externals");
        return pageArchitect.buildExternals()
    }

    //only build pages in production because server builds it in dev
    buildPro() {
        const promises = [];
        this.mapPluginsAndBuildExternals().then((_) => {
            const buildRegistrar = new BuildRegistrar(this.#$);
            this.#$.cli.log("Building Pages");
            for (const mapComponent of this.#$.map.values())
                promises.push(new Promise(resolve => {
                    pageArchitect.buildBabel(mapComponent).then(_ => {
                        buildRegistrar.registerForSemiBuild(mapComponent).then(_ => {
                            pageArchitect.buildDirect(mapComponent).then(_ => {
                                resolve();
                                this.#$.cli.ok(`Successfully built page ${mapComponent.getPage()}`)
                                pluginMapper.applyPlugin(mapComponent);
                            }).catch(err => {
                                throw err
                            });
                        }).catch(err => {
                            throw err
                        });
                    }).catch(err => {
                        throw err
                    });
                }));
        });
        return Promise.all(promises)
    }

    getContext() {
        return this.#$;
    }
}