require("./GlobalsSetter")
import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import {join} from "path";
import {mapPlugin} from "./mappers/PluginMapper";
import {FIREJS_MAP, PathRelatives} from "./FireJS";
import * as fs from "fs"

export default class {
    readonly map: Map<string, Page> = new Map()
    readonly renderer: StaticArchitect;
    readonly rel: PathRelatives;
    readonly rootDir: string;

    constructor(pathToLibDir: string, rootDir: string = process.cwd()) {
        const firejs_map: FIREJS_MAP = JSON.parse(fs.readFileSync(join(this.rootDir = rootDir, pathToLibDir, "firejs.map.json")).toString());
        firejs_map.staticConfig.pathToLib = join(rootDir, pathToLibDir);
        this.rel = firejs_map.staticConfig.rel
        this.renderer = new StaticArchitect(firejs_map.staticConfig);
        for (const __page in firejs_map.pageMap) {
            const page = new Page(__page);
            page.chunks = firejs_map.pageMap[__page];
            this.map.set(__page, page);
        }
    }

    loadPagePlugin(pluginPath: string) {
        mapPlugin(pluginPath, {pageMap: this.map, rootPath: this.rootDir}, undefined);
    }

    render(__page: string, path: string, content: any = {}): {
        html: string,
        map: string
    } {
        const page = this.map.get(__page);
        return {
            html: this.renderer.finalize(
                this.renderer.render(this.renderer.param.template, page, path, content)),
            map: `window.__MAP__=${JSON.stringify({
                content,
                chunks: page.chunks
            })}`
        }
    }
}