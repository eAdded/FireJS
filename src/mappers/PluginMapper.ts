import {readdirSync} from "fs";
import {join} from "path";
import Plugin from "../classes/Plugin";
import Page from "../classes/Page";

export function mapPlugins(pluginsPath: string, map: Map<string, Page>) {
    readdirSync(pluginsPath).forEach(pluginFile => {
        const pPath = join(pluginsPath, pluginFile);
        const plugin: Plugin = require(pPath).default;
        const page = map.get(plugin.page.getName());
        if (page)
            page.plugin = plugin;
    });
}