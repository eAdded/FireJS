"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function mapPlugins(inputFileSystem, pluginsPath, map) {
    inputFileSystem.readdirSync(pluginsPath).forEach(pluginFile => {
        const plugins = require(path_1.join(pluginsPath, pluginFile));
        for (const name in plugins) {
            const plugin = new plugins[name](name);
            // @ts-ignore
            if ((plugin.version || 0) < global.__MIN_PLUGIN_VERSION__)
                // @ts-ignore
                throw new Error(`Plugin ${pluginFile} is not supported. Update plugin to v` + global.__MIN_PLUGIN_VERSION__);
            const page = map.get(name);
            if (page)
                page.plugin = plugin;
            else
                throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`);
        }
    });
}
exports.mapPlugins = mapPlugins;
