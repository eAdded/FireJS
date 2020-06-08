import {join} from "path";
import Plugin from "../classes/Plugin";
import Page from "../classes/Page";
import {readDirRecursively} from "../utils/Fs";

export function mapPlugins(inputFileSystem, pluginsPath: string, map: Map<string, Page>) {
    readDirRecursively(pluginsPath, inputFileSystem, pluginFile => {
        const plugin: Plugin = new (require(pluginFile).default)();
        // @ts-ignore
        if ((plugin.version || "") < global.__MIN_PLUGIN_VERSION__)
            // @ts-ignore
            throw new Error(`Plugin ${pluginFile} is not supported. Update plugin to v` + global.__MIN_PLUGIN_VERSION__);

        const page = map.get(plugin.page);
        if (page)
            page.plugin = plugin;
        else
            throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`)
    });
}