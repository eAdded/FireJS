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
const Page_1 = require("./classes/Page");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const path_1 = require("path");
const PluginMapper_1 = require("./mappers/PluginMapper");
const fs = require("fs");
class default_1 {
    constructor(pathToLibDir, pathToPluginsDir = undefined, rootDir = process.cwd()) {
        this.map = new Map();
        const firejs_map = JSON.parse(fs.readFileSync(path_1.join(rootDir, pathToLibDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.pathToLib = path_1.join(rootDir, pathToLibDir);
        this.rel = firejs_map.staticConfig.rel;
        this.renderer = new StaticArchitect_1.default(firejs_map.staticConfig);
        for (const __page in firejs_map.pageMap) {
            const page = new Page_1.default(__page);
            page.chunks = firejs_map.pageMap[__page];
            this.map.set(__page, page);
        }
        if (pathToPluginsDir)
            PluginMapper_1.mapPlugins(fs, path_1.join(rootDir, pathToPluginsDir), this.map);
    }
    refreshPluginData(__page) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = this.map.get(__page).plugin;
            page.paths.clear();
            yield page.onBuild((path, content) => {
                page.paths.set(path, content);
            });
        });
    }
    renderWithPluginData(__page, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = this.map.get(__page);
            const content = page.plugin.paths.get(path);
            return {
                html: this.renderer.finalize(this.renderer.render(this.renderer.param.template, page, path, content || {})),
                map: `window.__MAP__=${JSON.stringify({
                    content,
                    chunks: page.chunks
                })}`
            };
        });
    }
    render(__page, path, content = {}) {
        const page = this.map.get(__page);
        return {
            html: this.renderer.finalize(this.renderer.render(this.renderer.param.template, page, path, content)),
            map: `window.__MAP__=${JSON.stringify({
                content,
                chunks: page.chunks
            })}`
        };
    }
}
exports.default = default_1;
