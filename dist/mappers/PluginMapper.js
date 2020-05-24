"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function mapPlugins(inputFileSystem, pluginsPath, map) {
    inputFileSystem.readdirSync(pluginsPath).forEach(pluginFile => {
        const plugin = new (require(path_1.join(pluginsPath, pluginFile)).default)();
        const page = map.get(plugin.page.toString());
        if (page)
            page.plugin = plugin;
    });
}
exports.mapPlugins = mapPlugins;
