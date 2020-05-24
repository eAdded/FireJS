"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("./classes/Page");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const path_1 = require("path");
const PluginMapper_1 = require("./mappers/PluginMapper");
const fs = require("fs");
class default_1 {
    constructor(pathToBabelDir, pathToPluginsDir = undefined, customPlugins = [], rootDir = process.cwd()) {
        this.map = new Map();
        const firejs_map = JSON.parse(fs.readFileSync(path_1.join(pathToBabelDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.babelPath = path_1.join(rootDir, pathToBabelDir);
        this.template = firejs_map.template;
        this.rel = firejs_map.staticConfig.rel;
        this.renderer = new StaticArchitect_1.default(firejs_map.staticConfig);
        for (const __page in firejs_map.pageMap) {
            const page = new Page_1.default(__page);
            page.chunkGroup = firejs_map.pageMap[__page];
            this.map.set(__page, page);
        }
        if (pathToPluginsDir)
            PluginMapper_1.mapPlugins(fs, pathToPluginsDir, this.map);
    }
    renderWithPluginData(__page, path) {
        return new Promise((resolve, reject) => {
            const page = this.map.get(__page);
            page.plugin.getContent(path).then(content => {
                resolve(this.renderer.finalize(this.renderer.render(this.template, page, path, content)));
            }).catch(reject);
        });
    }
    render(__page, path, content) {
        const page = this.map.get(__page);
        return this.renderer.finalize(this.renderer.render(this.template, page, path, content));
    }
}
exports.default = default_1;
