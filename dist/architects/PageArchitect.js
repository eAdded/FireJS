"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const MemoryFileSystem = require("memory-fs");
const WebpackArchitect_1 = require("./WebpackArchitect");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    buildExternals() {
        return new Promise((resolve, reject) => {
            this.build(new WebpackArchitect_1.default(this.$).externals(), undefined, stat => {
                stat.compilation.chunks.forEach(chunk => {
                    this.$.externals.push(...chunk.files);
                });
                resolve();
            }, reject);
        });
    }
    buildBabel(mapComponent, resolve, reject) {
        this.build(new WebpackArchitect_1.default(this.$).babel(mapComponent, this.$.webpackConfig), undefined, stat => {
            if (this.logStat(stat)) //true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunkGroup.babelChunk = file;
                        }
                        else //don't add babel main
                            mapComponent.chunkGroup.chunks.push(file);
                    });
                });
                resolve();
            }
        }, err => reject(err));
    }
    buildDirect(mapComponent, resolve, reject) {
        const fileSystem = this.$.config.pro ? undefined : new MemoryFileSystem();
        this.build(new WebpackArchitect_1.default(this.$).direct(mapComponent, this.$.webpackConfig), fileSystem, (stat) => {
            if (!this.$.config.pro) {
                mapComponent.chunkGroup.chunks = []; //re init for new chunks
                mapComponent.memoryFileSystem = fileSystem;
            }
            if (this.logStat(stat)) //true if errors
                reject(undefined);
            else {
                stat.compilation.chunks.forEach(chunk => {
                    chunk.files.forEach(file => {
                        if (file.startsWith("m")) {
                            mapComponent.chunkGroup.chunks.unshift(file); //add main chunk to the top
                        }
                        else
                            mapComponent.chunkGroup.chunks.push(file);
                    });
                });
                resolve();
            }
        }, reject);
    }
    build(config, fileSystem, resolve, reject) {
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
            // @ts-ignore
            this.$.cli.warn(`Warning in page ${stat.compilation.name}\n`, ...stat.compilation.warnings);
        }
        if (stat.hasErrors()) {
            if (stat.compilation.errors.length === 0)
                // @ts-ignore
                this.$.cli.error(`Error in page ${stat.compilation.name}`);
            else {
                // @ts-ignore
                this.$.cli.error(`Error in page ${stat.compilation.name}\n`, ...stat.compilation.errors);
            }
            if (this.$.config.pro)
                this.$.cli.log("Some errors might not be displayed in production mode. Try moving to development mode.");
            // @ts-ignore
            this.$.cli.error(`Unable to build page ${stat.compilation.name} with ${errorCount} error(s)`);
            return true;
        }
    }
}
exports.default = default_1;
