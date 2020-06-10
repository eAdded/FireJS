"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagePlugin_1 = require("../classes/Plugins/PagePlugin");
const GlobalPlugin_1 = require("../classes/Plugins/GlobalPlugin");
const FireJSPlugin_1 = require("../classes/Plugins/FireJSPlugin");
function mapPlugin(pluginPath, semiData = undefined, fullData) {
    const rawPlugs = require(require.resolve(pluginPath, { paths: [semiData ? semiData.rootPath : fullData.config.paths.root] }));
    for (const rawPlugKey in rawPlugs) {
        if (rawPlugs.hasOwnProperty(rawPlugKey)) {
            const rawPlug = new (rawPlugs[rawPlugKey])();
            if (rawPlug.plugCode === FireJSPlugin_1.PluginCode.PagePlugin) {
                checkVer(rawPlug, PagePlugin_1.PagePlugMinVer, rawPlugKey, pluginPath);
                managePagePlugin(rawPlug, pluginPath, semiData ? semiData.pageMap : fullData.pageMap);
            }
            else if (rawPlug.plugCode === FireJSPlugin_1.PluginCode.GlobalPlugin) {
                if (fullData) {
                    checkVer(rawPlug, GlobalPlugin_1.GlobalPlugMinVer, rawPlugKey, pluginPath);
                    manageGlobalPlugin(rawPlug, pluginPath, fullData);
                }
            }
            else
                throw new Error(`unknown plugin ${rawPlugKey} in ${pluginPath}`);
        }
    }
}
exports.mapPlugin = mapPlugin;
function checkVer(rawPlug, minVer, name, path) {
    if (rawPlug.version < minVer)
        throw new Error(`PagePlugin [${name}] in ${path} is outdated. Expected min version ${minVer} but found ${rawPlug.version}`);
}
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
