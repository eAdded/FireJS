import Plugin from "../classes/Plugins/Plugin";
import {$} from "../FireJS";
import PagePlugin from "../classes/Plugins/PagePlugin";
import GlobalPlugin from "../classes/Plugins/GlobalPlugin";

export function mapPlugin(pluginPath: string, $: $) {
    const rawPlugs: { [key: string]: typeof Plugin } = require(pluginPath);
    for (const rawPlugsKey in rawPlugs) {
        const rawPlug: typeof Plugin = rawPlugs[rawPlugsKey];
        if (rawPlug instanceof PagePlugin) {
            managePagePlugin(checkVersion(new rawPlug(name), pluginPath), pluginPath, $);
        } else if (rawPlug instanceof GlobalPlugin) {
            manageGlobalPlugin(checkVersion(new rawPlug(name), pluginPath), pluginPath, $);
        } else
            throw new Error(`Plugin ${pluginPath} is of unknown type ${typeof rawPlug}`)
    }
}

function managePagePlugin(plugin: PagePlugin, pluginFile: string, $: $): void | never {
    const page = $.pageMap.get(name);
    if (page)
        page.plugin = plugin;
    else
        throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`)
}

function manageGlobalPlugin(plugin: PagePlugin, pluginFile: string, $: $): void | never {

}

function checkVersion(plugin, pluginFile: string): any | never {
    // @ts-ignore
    if ((plugin.version || 0) < global.__MIN_PLUGIN_VERSION__)
        // @ts-ignore
        throw new Error(`Plugin ${pluginFile} is not supported. Update plugin to v` + global.__MIN_PLUGIN_VERSION__);
    return plugin;
}