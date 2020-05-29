import webpack = require("webpack");
import WebpackArchitect from "./WebpackArchitect";
import {$, WebpackConfig, WebpackStat} from "../FireJS";
import Page from "../classes/Page";
import {join} from "path";

export default class {
    private readonly $: $;
    private readonly webpackArchitect: WebpackArchitect
    public isOutputCustom: boolean
    public isInputCustom: boolean

    constructor(globalData: $, webpackArchitect, isOutputCustom: boolean, isInputCustom: boolean) {
        this.$ = globalData;
        this.webpackArchitect = webpackArchitect;
        this.isOutputCustom = isOutputCustom;
        this.isInputCustom = isInputCustom;
    }

    buildExternals() {
        return new Promise<string[]>((resolve, reject) => {
            this.build(this.webpackArchitect.forExternals(), stat => {
                const externals = [];
                stat.compilation.chunks.forEach(chunk => {
                    externals.push(...chunk.files);
                })
                resolve(externals);
            }, reject)
        })
    }

    buildPage(page: Page, resolve: () => void, reject: (err: any | undefined) => void) {
        this.build(this.webpackArchitect.forPage(page), (stat) => {
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                page.chunks.forEach(chunk => {
                    this.$.outputFileSystem.unlinkSync(join(this.$.config.paths.lib, chunk));
                })
                page.chunks = [];//reinit chunks
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m"))
                            page.chunks.unshift(file)//add main chunk to the top
                        else
                            page.chunks.push(file)
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
        if (this.$.config.verbose) {
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