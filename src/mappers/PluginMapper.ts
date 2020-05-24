import {join} from "path";
import Plugin from "../classes/Plugin";
import Page from "../classes/Page";

export function mapPlugins(inputFileSystem, pluginsPath: string, map: Map<string, Page>) {
    inputFileSystem.readdirSync(pluginsPath).forEach(pluginFile => {
        if (!pluginFile.endsWith(".js"))
            return
        const plugin: Plugin = new (require(join(pluginsPath, pluginFile)).default)();
        const page = map.get(plugin.page.toString());
        if (page)
            page.plugin = plugin;
        else
            throw new Error(`Page ${plugin.page.toString()} requested by plugin ${pluginFile} does not exist`)
    });
}