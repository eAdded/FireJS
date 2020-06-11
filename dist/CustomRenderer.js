"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./GlobalsSetter");
const Page_1 = require("./classes/Page");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const path_1 = require("path");
const PluginMapper_1 = require("./mappers/PluginMapper");
const fs = require("fs");
class default_1 {
    constructor(pathToLibDir, rootDir = process.cwd()) {
        this.map = new Map();
        const firejs_map = JSON.parse(fs.readFileSync(path_1.join(this.rootDir = rootDir, pathToLibDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.pathToLib = path_1.join(rootDir, pathToLibDir);
        this.rel = firejs_map.staticConfig.rel;
        this.renderer = new StaticArchitect_1.default(firejs_map.staticConfig);
        for (const __page in firejs_map.pageMap) {
            const page = new Page_1.default(__page);
            page.chunks = firejs_map.pageMap[__page];
            this.map.set(__page, page);
        }
    }
    loadPagePlugin(pluginPath) {
        PluginMapper_1.mapPlugin(pluginPath, { pageMap: this.map, rootPath: this.rootDir }, undefined);
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
