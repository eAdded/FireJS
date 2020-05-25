import {join} from "path"
import {watch} from "chokidar"
import FireJS, {$} from "./index"
import Page from "./classes/Page";
import express = require("express");


export default class {
    private readonly $: $
    private readonly app: FireJS;
    private cacheMap: Map<string, Map<string, string>> = new Map();

    constructor() {
        this.$ = (this.app = new FireJS()).getContext();
    }

    async init() {
        this
        this.$.cli.log("Caching data from plugins")
        watch(this.$.config.paths.pages)//watch changes
            .on('add', this.buildPage)
            .on('unlink', path => {
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
        this.$.cli.ok("Watching for file changes")
        const server: express.Application = express();
        this.$.renderer.param.externals.forEach(external =>//externals
            server.use(`${this.$.rel.libRel}${external}`, express.static(join(this.$.config.paths.dist, this.$.rel.libRel, external))));

        if (this.$.config.paths.static)
            server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));

        server.use((req, res, next) => {
            req.url = decodeURI(req.url);
            if (req.url.startsWith(this.$.rel.mapRel))
                this.getPageMap(req, res);
            else if (req.url.startsWith(this.$.rel.libRel))
                getLib(req, res);
            else
                getPage(req, res)
            next();
        });
        server.listen(5000, _ => {
            this.$.cli.ok("listening on port 5000");
        })
    }

    private async generatePageCache(page: Page) {
        const pathMap = new Map<string, string>();
        const promises = [];
        (await page.plugin.getPaths()).forEach(path => {
            promises.push(async () => pathMap.set(path, `window.__MAP__=${JSON.stringify({
                content: await page.plugin.getContent(path),
                chunks: page.chunkGroup.chunks
            })}`))
        })
        await Promise.all(promises);
        return pathMap;
    }

    private getPageMap(req: express.Request, res: express.Response) {
        let found = false;
        const path = req.url.substring(0, req.url.lastIndexOf(".map.js"));
        for (const pathsMap of this.cacheMap.values()) {
            const pathMap = pathsMap.get(path);
            if (found = !!pathMap) {
                res.end(pathMap)
                break
            }
        }
        if (!found)
            res.status(404);
    }

    private buildPage(page_path: string) {
        const page = new Page(page_path = page_path.replace(this.$.config.paths.pages + "/", ""));
        page.plugin =
            this.$.pageArchitect.buildDirect().buildDirect(mapComponent, () => {
                let pathsMap = this.cacheMap.get(page_path);
                $.cli.ok(`Successfully built page ${mapComponent.Page}`);
                // @ts-ignore
                if (!mapComponent.wasApplied) {
                    // @ts-ignore
                    mapComponent.wasApplied = true;
                    $.cli.log(`Applying plugin for page ${mapComponent.Page}`);
                    applyPlugin(mapComponent, $.rel, (pagePath: PagePath) => {
                        $.cli.ok(`Data fetched for path ${pagePath.Path}`);
                    });
                }
            }, err => {
                $.cli.error(`Error while building page ${mapComponent.Page}`, err);
            });
    }
}


export async function s(app: FireJS) {

    function getLib(req: express.Request, res: express.Response) {
        let found = false;
        let cleanUrl = "/" + req.url.substring(libRelative.length);
        for (const mapComponent of $.map.values()) {
            if ((found = mapComponent.memoryFileSystem.existsSync(cleanUrl))) {
                res.end(mapComponent.memoryFileSystem.readFileSync(cleanUrl));
                break;
            }
        }
        if (!found)
            res.status(404);
    }

    function getPage(req: express.Request, res: express.Response) {
        let found = false;
        for (const page of $.pageMap.values()) {
            if ((found = page.paths.some(pagePath => {
                if (req.url === pagePath.Path || (join(req.url, "index") === pagePath.Path)) {
                    res.end($.renderer.finalize($.renderer.render($.template, mapComponent.chunkGroup, pagePath, false)));
                    return true;
                }
            }))) break;
        }
        if (!found) {
            const _404_MapComponent = $.map.get($.config.pages["404"]);
            if (_404_MapComponent.paths.length > 0)
                res.end(staticArchitect.finalize(staticArchitect.render($.template, _404_MapComponent.chunkGroup, _404_MapComponent.paths[0], false)));
            else
                res.end("Please Wait...")
        }
    }

    function generateCache() {

    }
}