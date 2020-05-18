import webpack = require("webpack");
import MemoryFileSystem = require("memory-fs");
import WebpackArchitect from "./WebpackArchitect";
import {$} from "../index";
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
        this.build(new WebpackArchitect(this.$).babel(mapComponent), undefined, stat => {
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.babelChunk = file;
                        } else //don't add babel main
                            mapComponent.chunks.push(file);
                    })
                });
                resolve();
            }
        }, err => reject(err));
    }

    buildDirect(mapComponent: MapComponent, resolve: () => void, reject: (err: any | undefined) => void) {
        const fileSystem = this.$.config.pro ? undefined : new MemoryFileSystem();
        this.build(new WebpackArchitect(this.$).direct(mapComponent), fileSystem, (stat) => {
            if (!this.$.config.pro) {
                mapComponent.chunks = []; //re init for new chunks
                mapComponent.memoryFileSystem = fileSystem;
            }
            if (this.logStat(stat))//true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunks.unshift(file);//add main chunk to the top
                        } else
                            mapComponent.chunks.push(file);
                    })
                });
                resolve();
            }
        }, reject);
    }

    build(config: any, fileSystem: MemoryFileSystem | undefined, resolve: (stat) => void, reject: (err) => void) {
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

    logStat(stat) {
        let errorCount = 0;
        if (this.$.args["--verbose"]) {
            this.$.cli.log("Stat");
            this.$.cli.normal(stat);
        }
        if (stat.hasWarnings()) {
            this.$.cli.warn(`Warning in page ${stat.compilation.name}\n`, ...stat.compilation.warnings);
        }
        if (stat.hasErrors()) {
            if (stat.compilation.errors.length === 0)
                this.$.cli.error(`Error in page ${stat.compilation.name}`)
            else {
                this.$.cli.error(`Error in page ${stat.compilation.name}\n`, ...stat.compilation.errors);
            }
            if (this.$.config.pro)
                this.$.cli.log("Some errors might not be displayed in production mode. Try moving to development mode.")
            this.$.cli.error(`Unable to build page ${stat.compilation.name} with ${errorCount} error(s)`)
            return true;
        }
    }
}