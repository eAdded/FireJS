import webpack = require("webpack");
import MemoryFileSystem = require("memory-fs");
import WebpackArchitect from "./WebpackArchitect";
import {$, WebpackConfig, WebpackStat} from "../index";
import MapComponent from "../classes/MapComponent";

export default class {
    private readonly $: $;

    constructor(globalData: $) {
        this.$ = globalData;
    }

    buildExternals() {
        return new Promise((resolve, reject) => {
            this.build(new WebpackArchitect(this.$).externals(), undefined, stat => {
                stat.compilation.chunks.forEach(chunk => {
                    this.$.externals.push(...chunk.files);
                })
                resolve();
            }, reject)
        })
    }

    buildBabel(mapComponent: MapComponent, resolve: () => void, reject: (err: any | undefined) => void) {
        this.build(new WebpackArchitect(this.$).babel(mapComponent, this.$.webpackConfig), undefined, stat => {
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunkGroup.babelChunk = file;
                        } else //don't add babel main
                            mapComponent.chunkGroup.chunks.push(file);
                    })
                });
                resolve();
            }
        }, err => reject(err));
    }

    buildDirect(mapComponent: MapComponent, resolve: () => void, reject: (err: any | undefined) => void) {
        const fileSystem = this.$.config.pro ? undefined : new MemoryFileSystem();
        this.build(new WebpackArchitect(this.$).direct(mapComponent, this.$.webpackConfig), fileSystem, (stat) => {
            if (!this.$.config.pro) {
                mapComponent.chunkGroup.chunks = []; //re init for new chunks
                mapComponent.memoryFileSystem = fileSystem;
            }
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunkGroup.chunks.unshift(file);//add main chunk to the top
                        } else
                            mapComponent.chunkGroup.chunks.push(file);
                    })
                });
                resolve();
            }
        }, reject);
    }

    build(config: WebpackConfig, fileSystem: MemoryFileSystem | undefined, resolve: (stat) => void, reject: (err) => void) {
        const compiler = webpack(config);
        if (fileSystem)
            compiler.outputFileSystem = fileSystem;
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