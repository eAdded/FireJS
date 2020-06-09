import {join} from "path";
import Plugin from "../classes/Plugins";
import Page from "../classes/Page";

export function mapPlugins(inputFileSystem, pluginsPath: string, map: Map<string, Page>) {
    inputFileSystem.readdirSync(pluginsPath).forEach(pluginFile => {
        const plugins = require(join(pluginsPath, pluginFile));
        for (const name in plugins) {
            const plugin: Plugin = new plugins[name](name);
            // @ts-ignore
            if ((plugin.version || 0) < global.__MIN_PLUGIN_VERSION__)
                // @ts-ignore
                throw new Error(`Plugin ${pluginFile} is not supported. Update plugin to v` + global.__MIN_PLUGIN_VERSION__);
            const page = map.get(name);
            if (page)
                page.plugin = plugin;
            else
                throw new Error(`Page ${plugin.page} requested by plugin ${pluginFile} does not exist`)
        }
    });
}