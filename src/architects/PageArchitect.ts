import webpack = require("webpack");
import WebpackArchitect from "./WebpackArchitect";
import {$, WebpackConfig, WebpackStat} from "../index";
import Page from "../classes/Page";

export default class {
    private readonly $: $;
    private readonly webpackArchitect: WebpackArchitect
    private readonly isOutputCustom: boolean
    private readonly isInputCustom: boolean

    constructor(globalData: $, webpackArchitect, isOutputCustom: boolean, isInputCustom: boolean) {
        this.$ = globalData;
        this.webpackArchitect = webpackArchitect;
        this.isOutputCustom = isOutputCustom;
        this.isInputCustom = isInputCustom;
    }

    buildExternals() {
        return new Promise<string[]>((resolve, reject) => {
            this.build(this.webpackArchitect.externals(), stat => {
                const externals = [];
                stat.compilation.chunks.forEach(chunk => {
                    externals.push(...chunk.files);
                })
                resolve(externals);
            }, reject)
        })
    }

    buildBabel(page: Page, resolve: () => void, reject: (err: any | undefined) => void) {
        this.build(this.webpackArchitect.babel(page), stat => {
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m"))
                            page.chunkGroup.babelChunk = file;
                        else //don't add babel main
                            page.chunkGroup.chunks.push(file);
                    })
                });
                resolve();
            }
        }, reject);
    }

    buildDirect(page: Page, resolve: () => void, reject: (err: any | undefined) => void) {
        this.build(this.webpackArchitect.direct(page), (stat) => {
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m"))
                            page.chunkGroup.chunks.unshift(file)//add main chunk to the top
                        else
                            page.chunkGroup.chunks.push(file)
                    })
                });
                resolve();
            }
        }, reject);
    }

    build(config: WebpackConfig, resolve: (stat) => void, reject: (err) => void) {
        const compiler = webpack(config);
        if (this.isOutputCustom)
            compiler.outputFileSystem = this.$.outputFileSystem;
        if (this.isInputCustom)
            compiler.inputFileSystem = this.$.inputFileSystem;
        if (config.watch)
            compiler.watch({}, (err, stat) => {
                if (err)
                    reject(err);
                else
                    resolve(stat);
            });
        else
            compiler.run((err, stat) => {
                if (err)
                    reject(err);
                else
                    resolve(stat);
            });
    }

    logStat(stat: WebpackStat) {
        if (this.$.args["--verbose"]) {
            this.$.cli.log("Stat");
            this.$.cli.normal(stat);
        }
        if (stat.hasWarnings()) {
            // @ts-ignore
            this.$.cli.warn(`Warning in page ${stat.compilation.name}\n`, ...stat.compilation.warnings);
        }
        if (stat.hasErrors()) {
            if (stat.compilation.errors.length === 0) {
                // @ts-ignore
                this.$.cli.error(`Error in page ${stat.compilation.name}`)
            } else {
                // @ts-ignore
                this.$.cli.error(`Error in page ${stat.compilation.name}\n`, ...stat.compilation.errors);
            }
            // @ts-ignore
            this.$.cli.error(`Unable to build page ${stat.compilation.name} with ${stat.compilation.errors.length} error(s)`)
            return true;
        }
    }
}