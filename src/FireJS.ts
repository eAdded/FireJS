import ConfigMapper, {Args, Config, getArgs} from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import PageArchitect from "./architects/PageArchitect";
import {writeFileRecursively} from "./utils/Fs";
import * as fs from "fs"
import StaticArchitect, {StaticConfig} from "./architects/StaticArchitect";
import {createMap} from "./mappers/PathMapper";
import WebpackArchitect from "./architects/WebpackArchitect";

export type WebpackConfig = Configuration;
export type WebpackStat = Stats;

export interface PathRelatives {
    libRel: string,
    mapRel: string
}

export interface $ {
    args?: Args,
    config?: Config,
    pageMap?: Map<string, Page>,
    cli?: Cli,
    rel?: PathRelatives,
    outputFileSystem?,
    inputFileSystem?,
    renderer?: StaticArchitect,
    pageArchitect?: PageArchitect
}

export interface Params {
    config?: Config,
    args?: Args,
    webpackConfig?: WebpackConfig
    outputFileSystem?,
    inputFileSystem?
}

export interface FIREJS_MAP {
    staticConfig: StaticConfig,
    pageMap: {
        [key: string]: string[]
    },
}

export default class {
    private readonly $: $ = {};

    constructor(params: Params = {}) {
        this.$.args = params.args || getArgs();
        this.$.cli = new Cli(this.$.args["--plain"] ? "--plain" : this.$.args["--silent"] ? "--silent" : undefined);
        if (this.$.args["--help"]) {
            console.log("\n\n    \x1b[1m Fire JS \x1b[0m - Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.");
            console.log("\n    \x1b[1m Flags \x1b[0m\n" +
                "\n\t\x1b[34m--pro, -p\x1b[0m\n\t    Production Mode\n" +
                "\n\t\x1b[34m--conf, -c\x1b[0m\n\t    Path to Config file\n" +
                "\n\t\x1b[34m--verbose, -v\x1b[0m\n\t    Log Webpack Stat\n" +
                "\n\t\x1b[34m--plain\x1b[0m\n\t    Log without styling i.e colors and symbols\n" +
                "\n\t\x1b[34m--silent, s\x1b[0m\n\t    Log errors only\n" +
                "\n\t\x1b[34m--disable-plugins\x1b[0m\n\t    Disable plugins\n" +
                "\n\t\x1b[34m--help, -h\x1b[0m\n\t    Help")
            console.log("\n     \x1b[1mVersion :\x1b[0m 0.10.1");
            console.log("\n     \x1b[1mVisit https://github.com/eAdded/FireJS for documentation\x1b[0m\n\n")
            process.exit(0);
        }
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper(this.$.cli, this.$.args).getConfig(params.config);
        this.$.pageMap = createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
        this.$.pageArchitect = new PageArchitect(this.$, new WebpackArchitect(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
    }

    async init() {
        this.$.cli.log("Mapping Plugins");
        if (!this.$.args["--disable-plugins"])
            if (this.$.config.paths.plugins)
                mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
            else
                throw new Error("Plugins Dir Not found")
        this.$.cli.log("Building Externals");
        this.$.renderer = new StaticArchitect({
            rel: this.$.rel,
            pathToLib: this.$.config.paths.lib,
            externals: await this.$.pageArchitect.buildExternals(),
            explicitPages: this.$.config.pages,
            tags: this.$.config.templateTags,
            template: this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString()
        })
        this.$.cli.log("Copying index chunk")
        const index_bundle_out_path = join(this.$.config.paths.lib, "i21345bb373762325b784.js")
        if (this.$.config.pro)
            this.$.outputFileSystem.exists(index_bundle_out_path, exists => {
                if (!exists)
                    this.$.inputFileSystem.createReadStream(join(__dirname, "../web/dist/i21345bb373762325b784.js")).pipe(this.$.outputFileSystem.createWriteStream(index_bundle_out_path));
            })
    }

    buildPage(page: Page) {
        return new Promise<any>(resolve => {
                this.$.pageArchitect.buildPage(page, async () => {
                    this.$.cli.ok(`Successfully built page ${page.toString()}`)
                    await page.plugin.initPaths();
                    const promises = [];
                    page.plugin.paths.forEach(path => {
                        promises.push((async () => {
                            const content = await page.plugin.getContent(path)
                            await Promise.all([
                                writeFileRecursively(join(this.$.config.paths.map, `${path}.map.js`), `window.__MAP__=${JSON.stringify({
                                    content,
                                    chunks: page.chunks
                                })}`, this.$.outputFileSystem),
                                writeFileRecursively(join(this.$.config.paths.dist, `${path}.html`),
                                    this.$.renderer.finalize(this.$.renderer.render(this.$.renderer.param.template, page, path, this.$.config.pro ? content : undefined)),
                                    this.$.outputFileSystem
                                )
                            ]);
                        })())
                    })
                    Promise.all(promises).then(resolve)
                }, err => {
                    throw err;
                })
            }
        )
    }

    getContext(): $ {
        return this.$;
    }
}