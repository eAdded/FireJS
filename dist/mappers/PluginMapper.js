"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function mapPlugins(pluginsPath, map) {
    fs_1.readdirSync(pluginsPath).forEach(pluginFile => {
        const pPath = path_1.join(pluginsPath, pluginFile);
        const plugin = require(pPath).default;
        const page = map.get(plugin.page.getName());
        if (page)
            page.plugin = plugin;
    });
}
exports.mapPlugins = mapPlugins;
