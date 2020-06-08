"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs_1 = require("../utils/Fs");
function mapPlugins(inputFileSystem, pluginsPath, map) {
    Fs_1.readDirRecursively(pluginsPath, inputFileSystem, pluginFile => {
        const plugin = new (require(pluginFile).default)();
        // @ts-ignore
        if ((plugin.version || "") < global.__MIN_PLUGIN_VERSION__)
            // @ts-ignore
            throw new Error(`Plugin ${pluginFile} is not supported. Update plugin to v` + global.__MIN_PLUGIN_VERSION__);
        const page = map.get(plugin.page);
        if (page)
            page.plugin = plugin;
        else
            throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`);
    });
}
exports.mapPlugins = mapPlugins;
