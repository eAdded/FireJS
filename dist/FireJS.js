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
// @ts-ignore
global.__MIN_PLUGIN_VERSION__ = "0.11.0";
// @ts-ignore
global.__FIREJS_VERSION__ = "0.13.0";
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const Cli_1 = require("./utils/Cli");
const Page_1 = require("./classes/Page");
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
        if (params.config.paths.webpackConfig)
            throw new Error("pass webpack config as params instead of passing it's path");
        // @ts-ignore
        fs.mkdirp = fs_extra_1.mkdirp;
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper_1.default(this.$.inputFileSystem, this.$.outputFileSystem).getConfig(params.config);
        this.$.cli = new Cli_1.default(this.$.config.logMode);
        this.$.pageMap = PathMapper_1.createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        if (!this.$.config.pages["404"]) {
            this.$.config.pages["404"] = path_1.relative(this.$.config.paths.pages, path_1.join(__dirname, "../web/404/404.jsx"));
            this.$.pageMap.set(this.$.config.pages["404"], new Page_1.default(this.$.config.pages["404"]));
        }
        this.$.rel = {
            libRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.map)
        };
        this.$.pageArchitect = new PageArchitect_1.default(this.$, new WebpackArchitect_1.default(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
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
                template: this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString()
            });
            //load externals only when they are required
            if (!this.$.pageArchitect.isOutputCustom) {
                this.$.cli.log("Initializing externals");
                // @ts-ignore
                global.window = {};
                this.$.renderer.param.externals.forEach(external => {
                    require(path_1.join(this.$.config.paths.lib, external));
                });
                require("../web/LinkApi.js");
                // @ts-ignore
                global.React = global.window.React;
                // @ts-ignore
                global.ReactDOM = global.window.ReactDOM;
                // @ts-ignore
                global.ReactHelmet = global.window.ReactHelmet;
                // @ts-ignore
                global.LinkApi = global.window.LinkApi;
            }
            this.$.cli.log("Copying index chunk");
            const index_bundle_out_path = path_1.join(this.$.config.paths.lib, "i244ca8c4e9b1d7c62a82.js");
            this.$.outputFileSystem.exists(index_bundle_out_path, exists => {
                if (!exists)
                    this.$.inputFileSystem.createReadStream(path_1.join(__dirname, "../web/dist/i244ca8c4e9b1d7c62a82.js")).pipe(this.$.outputFileSystem.createWriteStream(index_bundle_out_path));
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
                    Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.dist, `${path}.html`), this.$.renderer.finalize(this.$.renderer.render(this.$.renderer.param.template, page, path, this.$.pageArchitect.isOutputCustom ? undefined : content)), this.$.outputFileSystem).catch(err => {
                        throw err;
                    });
                }, resolve).catch(err => {
                    throw err;
                });
            }, reject);
        });
    }
    getContext() {
        return this.$;
    }
}
exports.default = default_1;
