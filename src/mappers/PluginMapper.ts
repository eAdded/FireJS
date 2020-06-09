import Plugin from "../classes/Plugins/Plugin";
import {$} from "../FireJS";
import PagePlugin from "../classes/Plugins/PagePlugin";
import GlobalPlugin from "../classes/Plugins/GlobalPlugin";

export function mapPlugin(pluginPath: string, $: $) {
    const rawPlugs: { [key: string]: typeof Plugin } = require(require.resolve(pluginPath, {paths: [$.config.paths.root]}));
    for (const rawPlugsKey in rawPlugs) {
        const rawPlug: Plugin = new (rawPlugs[rawPlugsKey])();
        if (rawPlug instanceof PagePlugin)
            // @ts-ignore
            managePagePlugin(checkVersion(rawPlug, pluginPath, global.__MIN_PAGE_PLUGIN_VERSION__), pluginPath, $);
        else if (rawPlug instanceof GlobalPlugin)
            // @ts-ignore
            manageGlobalPlugin(checkVersion(rawPlug, pluginPath, global.__MIN_GLOBAL_PLUGIN_VERSION__), pluginPath, $);
        else
            throw new Error(`Plugin ${pluginPath} is of unknown type ${typeof rawPlug}`)
    }
}

function managePagePlugin(plugin: PagePlugin, pluginFile: string, $: $): void | never {
    const page = $.pageMap.get(plugin.page);
    if (page)
        page.plugin = plugin;
    else
        throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`)
}

function manageGlobalPlugin(plugin: GlobalPlugin, pluginFile: string, $: $): void | never {
    plugin.initWebpack($.pageArchitect.webpackArchitect.defaultConfig);
    $.globalPlugins.push(plugin);
}

function checkVersion(plugin, pluginFile: string, version: number): any | never {
    // @ts-ignore
    if (plugin.version < version)
        // @ts-ignore
        throw new Error(`Plugin ${pluginFile} is not supported. Update plugin to v` + version);
    return plugin;
}