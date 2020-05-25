import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import {join} from "path";
import {mapPlugins} from "./mappers/PluginMapper";
import {FIREJS_MAP, PathRelatives} from "./FireJS";
import * as fs from "fs"

interface RenderReturn {
    html: string,
    map: string
}

export default class {
    readonly map: Map<string, Page> = new Map()
    readonly renderer: StaticArchitect;
    readonly template: string;
    readonly rel: PathRelatives;

    constructor(pathToBabelDir: string, pathToPluginsDir: string | undefined = undefined, rootDir: string = process.cwd()) {
        const firejs_map: FIREJS_MAP = JSON.parse(fs.readFileSync(join(rootDir, pathToBabelDir, "firejs.map.json")).toString());
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
            mapPlugins(fs, join(rootDir, pathToPluginsDir), this.map);
    }

    renderWithPluginData(__page: string, path: string) {
        return new Promise<RenderReturn>((resolve, reject) => {
            const page = this.map.get(__page);
            page.plugin.getContent(path).then(content => {
                resolve({
                    html: this.renderer.finalize(
                        this.renderer.render(this.template, page, path, content || {})),
                    map: `window.__MAP__=${JSON.stringify({
                        content,
                        chunks: page.chunkGroup.chunks
                    })}`
                })
            }).catch(reject);
        })
    }

    render(__page: string, path: string, content: any = {}): RenderReturn {
        const page = this.map.get(__page);
        return {
            html: this.renderer.finalize(
                this.renderer.render(this.template, page, path, content)),
            map: `window.__MAP__=${JSON.stringify({
                content,
                chunks: page.chunkGroup.chunks
            })}`
        }
    }
}