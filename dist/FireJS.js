"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./GlobalsSetter");
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const Cli_1 = require("./utils/Cli");
const path_1 = require("path");
const PluginMapper_1 = require("./mappers/PluginMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const Fs_1 = require("./utils/Fs");
const fs_extra_1 = require("fs-extra");
const fs = require("fs");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const PathMapper_1 = require("./mappers/PathMapper");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
class default_1 {
    constructor(params) {
        this.$ = {};
        params = this.constructParams(params);
        process.env.NODE_ENV = params.config.pro ? 'production' : 'development';
        if (params.config.paths.webpackConfig)
            throw new Error("pass webpack config as params instead of passing it's path");
        // @ts-ignore
        fs.mkdirp = fs_extra_1.mkdirp;
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper_1.default(this.$.inputFileSystem, this.$.outputFileSystem).getConfig(params.config);
        this.$.cli = new Cli_1.default(this.$.config.logMode);
        this.$.cli.ok(`NODE_ENV : ${process.env.NODE_ENV}`);
        this.$.cli.ok(`SSR : ${this.$.config.ssr}`);
        this.$.pageMap = PathMapper_1.createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.map)
        };
        this.$.pageArchitect = new PageArchitect_1.default(this.$, new WebpackArchitect_1.default(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
    }
    constructParams(params) {
        params = params || {};
        params.config = params.config || {};
        params.config.paths = params.config.paths || {};
        params.config.templateTags = params.config.templateTags || {};
        params.webpackConfig = params.webpackConfig || {};
        return params;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$.cli.log("Mapping Plugins");
            if (!this.$.config.disablePlugins)
                if (this.$.config.paths.plugins)
                    PluginMapper_1.mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
            this.$.cli.log("Building Externals");
            this.$.renderer = new StaticArchitect_1.default({
                rel: this.$.rel,
                pathToLib: this.$.config.paths.lib,
                externals: yield this.$.pageArchitect.buildExternals(),
                explicitPages: this.$.config.pages,
                tags: this.$.config.templateTags,
                template: this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString(),
                ssr: this.$.config.ssr
            });
        });
    }
    buildPage(page) {
        return new Promise((resolve, reject) => {
            this.$.pageArchitect.buildPage(page, () => {
                this.$.cli.ok(`Successfully built page ${page.toString()}`);
                page.plugin.paths.clear();
                page.plugin.onBuild((path, content) => {
                    page.plugin.paths.set(path, undefined);
                    Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.map, `${path}.map.js`), `window.__MAP__=${JSON.stringify({
                        content,
                        chunks: page.chunks
                    })}`, this.$.outputFileSystem).catch(err => {
                        throw err;
                    });
                    Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.dist, `${path}.html`), this.$.renderer.finalize(this.$.renderer.render(this.$.renderer.param.template, page, path, content)), this.$.outputFileSystem).catch(err => {
                        throw err;
                    });
                }, resolve).catch(err => {
                    throw err;
                });
            }, reject);
        });
    }
    export() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            this.$.pageMap.forEach(page => {
                promises.push(this.buildPage(page));
            });
            return Promise.all(promises);
        });
    }
    exportFly() {
        return new Promise((resolve) => {
            const map = {
                staticConfig: this.$.renderer.param,
                pageMap: {},
            };
            //replace template cause its been edited
            map.staticConfig.template = this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString();
            const promises = [];
            for (const page of this.$.pageMap.values()) {
                promises.push(new Promise(resolve => {
                    this.buildPage(page).then(() => {
                        map.pageMap[page.toString()] = page.chunks;
                        const chunkPath = path_1.join(this.$.config.paths.lib, page.chunks[0]);
                        this.$.outputFileSystem.copyFile(chunkPath, path_1.join(this.$.config.paths.fly, page.chunks[0]), err => {
                            resolve();
                            if (err)
                                throw new Error(`Error while moving ${chunkPath} to ${this.$.config.paths.fly}`);
                        });
                    });
                }));
            }
            const fullExternalName = map.staticConfig.externals[0].substr(map.staticConfig.externals[0].lastIndexOf("/") + 1);
            this.$.outputFileSystem.rename(path_1.join(this.$.config.paths.lib, map.staticConfig.externals[0]), path_1.join(this.$.config.paths.fly, fullExternalName), err => {
                if (err)
                    throw new Error(`Error while moving ${fullExternalName} to ${this.$.config.paths.fly}`);
                map.staticConfig.externals[0] = fullExternalName;
                Promise.all(promises).then(() => this.$.outputFileSystem.writeFile(path_1.join(this.$.config.paths.fly, "firejs.map.json"), JSON.stringify(map), resolve));
            });
        });
    }
    getContext() {
        return this.$;
    }
}
exports.default = default_1;
