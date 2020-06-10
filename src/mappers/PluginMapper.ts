import {$} from "../FireJS";
import PagePlugin, {PagePlugMinVer} from "../classes/Plugins/PagePlugin";
import GlobalPlugin, {GlobalPlugMinVer} from "../classes/Plugins/GlobalPlugin";
import Page from "../classes/Page";
import FireJSPlugin, {PluginCode} from "../classes/Plugins/FireJSPlugin";

export function mapPlugin(pluginPath: string, semiData: { rootPath: string, pageMap: Map<string, Page> } = undefined, fullData: $) {
    const rawPlugs = require(require.resolve(pluginPath, {paths: [semiData ? semiData.rootPath : fullData.config.paths.root]}));
    for (const rawPlugKey in rawPlugs) {
        if (rawPlugs.hasOwnProperty(rawPlugKey)) {
            const rawPlug = new (rawPlugs[rawPlugKey])() as FireJSPlugin;
            if (rawPlug.plugCode === PluginCode.PagePlugin) {
                checkVer(rawPlug, PagePlugMinVer, rawPlugKey)
                managePagePlugin(<PagePlugin>rawPlug, pluginPath, semiData ? semiData.pageMap : fullData.pageMap);
            } else if (rawPlug.plugCode === PluginCode.GlobalPlugin) {
                if (fullData) {
                    checkVer(rawPlug, GlobalPlugMinVer, rawPlugKey)
                    manageGlobalPlugin(<GlobalPlugin>rawPlug, pluginPath, fullData);
                }
            } else
                throw new Error(`Plugin ${pluginPath} is of unknown type ${typeof rawPlug}`)
        }
    }
}

function checkVer(rawPlug: FireJSPlugin, minVer: number, name: string) {
    if (rawPlug.version < minVer)
        throw new Error(`PagePlugin [${name}] is outdated. Expected min version ${PagePlugMinVer} but found ${rawPlug.version}`)
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