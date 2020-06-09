"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagePlugin_1 = require("../classes/Plugins/PagePlugin");
const GlobalPlugin_1 = require("../classes/Plugins/GlobalPlugin");
function mapPlugin(pluginPath, pagePluginData = undefined, fullData) {
    const rawPlugs = require(require.resolve(pluginPath, { paths: [pagePluginData.rootPath || fullData.config.paths.root] }));
    for (const rawPlugsKey in rawPlugs) {
        const rawPlug = new (rawPlugs[rawPlugsKey])();
        if (rawPlug instanceof PagePlugin_1.default) {
            if (pagePluginData)
                managePagePlugin(rawPlug, pluginPath, pagePluginData.pageMap);
            else
                managePagePlugin(rawPlug, pluginPath, fullData.pageMap);
        }
        else if (rawPlug instanceof GlobalPlugin_1.default) {
            if (fullData)
                manageGlobalPlugin(rawPlug, pluginPath, fullData);
        }
        else
            throw new Error(`Plugin ${pluginPath} is of unknown type ${typeof rawPlug}`);
    }
}
exports.mapPlugin = mapPlugin;
function managePagePlugin(plugin, pluginFile, pageMap) {
    const page = pageMap.get(plugin.page);
    if (page)
        page.plugin = plugin;
    else
        throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`);
}
function manageGlobalPlugin(plugin, pluginFile, $) {
    plugin.initWebpack($.pageArchitect.webpackArchitect.defaultConfig);
    $.globalPlugins.push(plugin);
}
