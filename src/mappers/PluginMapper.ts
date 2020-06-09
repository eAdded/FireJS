import {$} from "../FireJS";
import PagePlugin from "../classes/Plugins/PagePlugin";
import GlobalPlugin from "../classes/Plugins/GlobalPlugin";

export function mapPlugin(pluginPath: string, $: $) {
    const rawPlugs = require(require.resolve(pluginPath, {paths: [$.config.paths.root]}));
    for (const rawPlugsKey in rawPlugs) {
        const rawPlug = new (rawPlugs[rawPlugsKey])();
        if (rawPlug instanceof PagePlugin)
            managePagePlugin(rawPlug, pluginPath, $);
        else if (rawPlug instanceof GlobalPlugin)
            manageGlobalPlugin(rawPlug, pluginPath, $);
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