require("./GlobalsSetter")
import ConfigMapper, {Config} from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import {Configuration, Stats} from "webpack";
import {join, relative} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import PageArchitect from "./architects/PageArchitect";
import {writeFileRecursively} from "./utils/Fs";
import {mkdirp} from "fs-extra"
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

    private constructParams(params: Params): Params {
        params = params || {}
        params.config = params.config || {};
        params.config.paths = params.config.paths || {};
        params.config.templateTags = params.config.templateTags || {};
        params.webpackConfig = params.webpackConfig || {};
        return params;
    }

    constructor(params: Params) {
        params = this.constructParams(params);
        process.env.NODE_ENV = params.config.pro ? 'production' : 'development';
        if (params.config.paths.webpackConfig)
            throw new Error("pass webpack config as params instead of passing it's path");
        // @ts-ignore
        fs.mkdirp = mkdirp;
        this.$.inputFileSystem = params.inputFileSystem || fs
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper(this.$.inputFileSystem, this.$.outputFileSystem).getConfig(params.config)
        this.$.cli = new Cli(this.$.config.logMode);
        this.$.cli.ok(`NODE_ENV : ${process.env.NODE_ENV}`)
        this.$.cli.ok(`SSR : ${this.$.config.ssr}`)
        this.$.pageMap = createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: relative(this.$.config.paths.dist, this.$.config.paths.map)
        }
        this.$.pageArchitect = new PageArchitect(this.$, new WebpackArchitect(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
    }

    async init() {
        this.$.cli.log("Mapping Plugins");
        if (!this.$.config.disablePlugins)
            if (this.$.config.paths.plugins)
                mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
        this.$.cli.log("Building Externals");
        this.$.renderer = new StaticArchitect({
            rel: this.$.rel,
            pathToLib: this.$.config.paths.lib,
            externals: await this.$.pageArchitect.buildExternals(),
            explicitPages: this.$.config.pages,
            tags: this.$.config.templateTags,
            template: this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString(),
            ssr: this.$.config.ssr
        })
    }

    buildPage(page: Page): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.$.pageArchitect.buildPage(page, () => {
                this.$.cli.ok(`Successfully built page ${page.toString()}`)
                page.plugin.onBuild((path, content) => {
                    writeFileRecursively(join(this.$.config.paths.map, `${path}.map.js`), `window.__MAP__=${JSON.stringify({
                        content,
                        chunks: page.chunks
                    })}`, this.$.outputFileSystem).catch(err => {
                        throw err
                    });
                    writeFileRecursively(join(this.$.config.paths.dist, `${path}.html`),
                        this.$.renderer.finalize(this.$.renderer.render(this.$.renderer.param.template, page, path, content)),
                        this.$.outputFileSystem
                    ).catch(err => {
                        throw err
                    });
                }).then(resolve).catch(err => {
                    throw err
                })
            }, reject)
        })
    }

    async export() {
        const promises = []
        this.$.pageMap.forEach(page => {
            promises.push(this.buildPage(page));
        })
        return Promise.all(promises);
    }

    exportFly() {
        return new Promise((resolve) => {
            const map: FIREJS_MAP = {
                staticConfig: {
                    ...this.$.renderer.param,
                    template: this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString()
                },
                pageMap: {},
            }
            const promises = [];
            for (const page of this.$.pageMap.values()) {
                promises.push(new Promise(resolve => {
                    this.buildPage(page).then(() => {
                        map.pageMap[page.toString()] = page.chunks;
                        const chunkPath = join(this.$.config.paths.lib, page.chunks[0]);
                        this.$.outputFileSystem.copyFile(chunkPath, join(this.$.config.paths.fly, page.chunks[0]), err => {
                            resolve();
                            if (err)
                                throw new Error(`Error while moving ${chunkPath} to ${this.$.config.paths.fly}`);
                        });
                    });
                }))
            }
            const fullExternalName = map.staticConfig.externals[0].substr(map.staticConfig.externals[0].lastIndexOf("/") + 1);
            this.$.outputFileSystem.rename(join(this.$.config.paths.lib, map.staticConfig.externals[0]), join(this.$.config.paths.fly, fullExternalName), err => {
                if (err)
                    throw new Error(`Error while moving ${fullExternalName} to ${this.$.config.paths.fly}`);
                map.staticConfig.externals[0] = fullExternalName;
                Promise.all(promises).then(() =>
                    this.$.outputFileSystem.writeFile(join(this.$.config.paths.fly, "firejs.map.json"),
                        JSON.stringify(map), resolve))
            })
        })
    }

    getContext(): $ {
        return this.$;
    }
}
