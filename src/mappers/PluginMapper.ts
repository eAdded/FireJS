import {$} from "../FireJS";
import PagePlugin from "../classes/Plugins/PagePlugin";
import GlobalPlugin from "../classes/Plugins/GlobalPlugin";
import Page from "../classes/Page";

export function mapPlugin(pluginPath: string, pagePluginData: { rootPath: string, pageMap: Map<string, Page> } = undefined, fullData: $) {
    const rawPlugs = require(require.resolve(pluginPath, {paths: [pagePluginData.rootPath || fullData.config.paths.root]}));
    for (const rawPlugsKey in rawPlugs) {
        const rawPlug = new (rawPlugs[rawPlugsKey])();
        if (rawPlug instanceof PagePlugin) {
            if (pagePluginData)
                managePagePlugin(rawPlug, pluginPath, pagePluginData.pageMap);
            else
                managePagePlugin(rawPlug, pluginPath, fullData.pageMap);
        } else if (rawPlug instanceof GlobalPlugin) {
            if (fullData)
                manageGlobalPlugin(rawPlug, pluginPath, fullData);
        } else
            throw new Error(`Plugin ${pluginPath} is of unknown type ${typeof rawPlug}`)
    }
}

function managePagePlugin(plugin: PagePlugin, pluginFile: string, pageMap: Map<string, Page>): void | never {
    const page = pageMap.get(plugin.page);
    if (page)
        page.plugin = plugin;
    else
        throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`)
}

function manageGlobalPlugin(plugin: GlobalPlugin, pluginFile: string, $): void | never {
    plugin.initWebpack($.pageArchitect.webpackArchitect.defaultConfig);
    $.globalPlugins.push(plugin);
}