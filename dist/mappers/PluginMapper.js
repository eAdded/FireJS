"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function mapPlugins(inputFileSystem, pluginsPath, map) {
    inputFileSystem.readdirSync(pluginsPath).forEach(pluginFile => {
        if (pluginFile.endsWith(".ts"))
            return;
        const plugin = new (require(path_1.join(pluginsPath, pluginFile)).default)();
        const page = map.get(plugin.page);
        if (page)
            page.plugin = plugin;
        else
            throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`);
    });
}
exports.mapPlugins = mapPlugins;
