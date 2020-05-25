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
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const Cli_1 = require("./utils/Cli");
const path_1 = require("path");
const PluginMapper_1 = require("./mappers/PluginMapper");
const PageArchitect_1 = require("./architects/PageArchitect");
const Fs_1 = require("./utils/Fs");
const fs = require("fs");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const PathMapper_1 = require("./mappers/PathMapper");
const WebpackArchitect_1 = require("./architects/WebpackArchitect");
class default_1 {
    constructor(params = {}) {
        this.$ = {};
        this.$.args = params.args || ConfigMapper_1.getArgs();
        this.$.cli = new Cli_1.default(this.$.args["--plain"] ? "--plain" : this.$.args["--silent"] ? "--silent" : undefined);
        if (this.$.args["--help"]) {
            console.log("\n\n    \x1b[1m Fire JS \x1b[0m - Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.");
            console.log("\n    \x1b[1m Flags \x1b[0m\n" +
                "\n\t\x1b[34m--pro, -p\x1b[0m\n\t    Production Mode\n" +
                "\n\t\x1b[34m--conf, -c\x1b[0m\n\t    Path to Config file\n" +
                "\n\t\x1b[34m--verbose, -v\x1b[0m\n\t    Log Webpack Stat\n" +
                "\n\t\x1b[34m--plain\x1b[0m\n\t    Log without styling i.e colors and symbols\n" +
                "\n\t\x1b[34m--silent, s\x1b[0m\n\t    Log errors only\n" +
                "\n\t\x1b[34m--disable-plugins\x1b[0m\n\t    Disable plugins\n" +
                "\n\t\x1b[34m--help, -h\x1b[0m\n\t    Help");
            console.log("\n     \x1b[1mVersion :\x1b[0m 1.0.0");
            console.log("\n     \x1b[1mVisit https://github.com/eAdded/FireJS for documentation\x1b[0m\n\n");
            process.exit(0);
        }
        this.$.inputFileSystem = params.inputFileSystem || fs;
        this.$.outputFileSystem = params.outputFileSystem || fs;
        this.$.config = new ConfigMapper_1.default(this.$.cli, this.$.args).getConfig(params.config);
        this.$.template = params.template || this.$.inputFileSystem.readFileSync(this.$.config.paths.template).toString();
        this.$.pageMap = params.pages ? PathMapper_1.convertToMap(params.pages) : PathMapper_1.createMap(this.$.config.paths.pages, this.$.inputFileSystem);
        this.$.rel = {
            libRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.lib),
            mapRel: path_1.relative(this.$.config.paths.dist, this.$.config.paths.map)
        };
        this.$.pageArchitect = new PageArchitect_1.default(this.$, new WebpackArchitect_1.default(this.$, params.webpackConfig), !!params.outputFileSystem, !!params.inputFileSystem);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$.cli.log("Mapping Plugins");
            if (!this.$.args["--disable-plugins"])
                if (this.$.config.paths.plugins)
                    PluginMapper_1.mapPlugins(this.$.inputFileSystem, this.$.config.paths.plugins, this.$.pageMap);
                else
                    throw new Error("Plugins Dir Not found");
            this.$.cli.log("Building Externals");
            this.$.renderer = new StaticArchitect_1.default({
                rel: this.$.rel,
                babelPath: this.$.config.paths.babel,
                externals: yield this.$.pageArchitect.buildExternals(),
                explicitPages: this.$.config.pages,
                tags: this.$.config.templateTags,
            });
        });
    }
    buildPro() {
        return new Promise((resolve, reject) => {
            if (!this.$.config.pro)
                throw new Error("Not in production mode. Make sure to pass [--pro, -p] flag");
            this.$.cli.log("Building Pages");
            const promises = [];
            for (const page of this.$.pageMap.values())
                promises.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    yield this.$.pageArchitect.buildBabel(page);
                    yield Fs_1.moveChunks(page, this.$, this.$.outputFileSystem);
                    this.$.pageArchitect.buildDirect(page, () => __awaiter(this, void 0, void 0, function* () {
                        this.$.cli.ok(`Successfully built page ${page.toString()}`);
                        yield page.plugin.initPaths();
                        yield page.plugin.paths.forEach(path => {
                            (() => __awaiter(this, void 0, void 0, function* () {
                                const content = yield page.plugin.getContent(path);
                                yield Promise.all([
                                    Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.map, `${path}.map.js`), `window.__MAP__=${JSON.stringify({
                                        content,
                                        chunks: page.chunkGroup.chunks
                                    })}`, this.$.outputFileSystem),
                                    Fs_1.writeFileRecursively(path_1.join(this.$.config.paths.dist, `${path}.html`), this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, content)), this.$.outputFileSystem)
                                ]);
                                resolve();
                            }))();
                        });
                    }), err => {
                        throw err;
                    });
                })));
            Promise.all(promises).then(resolve).catch(reject);
        });
    }
    getContext() {
        return this.$;
    }
}
exports.default = default_1;
