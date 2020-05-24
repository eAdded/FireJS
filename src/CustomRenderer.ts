import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import {join} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import {FIREJS_MAP, PathRelatives} from "./index";
import * as fs from "fs"

export default class {
    readonly map: Map<string, Page> = new Map()
    readonly renderer: StaticArchitect;
    readonly template: string;
    readonly rel: PathRelatives;

    constructor(pathToBabelDir: string, pathToPluginsDir: string | undefined = undefined, customPlugins: string[] = [], rootDir: string = process.cwd()) {
        const firejs_map: FIREJS_MAP = JSON.parse(fs.readFileSync(join(pathToBabelDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.babelPath = join(rootDir, pathToBabelDir);
        this.template = firejs_map.template;
        this.rel = firejs_map.staticConfig.rel
        this.renderer = new StaticArchitect(firejs_map.staticConfig);
        for (const __page in firejs_map.pageMap) {
            const page = new Page(__page);
            page.chunkGroup = firejs_map.pageMap[__page];
            this.map.set(__page, page);
        }
        if (pathToPluginsDir)
            mapPlugins(fs, pathToPluginsDir, this.map);
    }

    renderWithPluginData(__page: string, path: string) {
        return new Promise<string>((resolve, reject) => {
            const page = this.map.get(__page);
            page.plugin.getContent(path).then(content => {
                resolve(this.renderer.finalize(
                    this.renderer.render(this.template, page, path, content)));
            }).catch(reject);
        })
    }

    render(__page: string, path: string, content: any) {
        const page = this.map.get(__page);
        return this.renderer.finalize(
            this.renderer.render(this.template, page, path, content));
    }
}