import {join} from "path"
import {watch} from "chokidar"
import FireJS, {$} from "./index"
import MemoryFS = require("memory-fs");
import express = require("express");

export default class {
    private readonly $: $
    private readonly app: FireJS;

    constructor(app: FireJS) {
        this.app = app;
        this.$ = app.getContext();
        this.$.outputFileSystem = new MemoryFS()
        this.$.pageArchitect.isOutputCustom = true;
    }

    async init() {
        await this.app.init();
        watch(this.$.config.paths.pages)//watch changes
            .on('add', this.buildPage.bind(this))
            .on('unlink', path => {
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
        /*watch(this.$.config.paths.plugins)//watch changes
            .on('add', this.buildPage)
            .on('unlink', path => {
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });*/
        this.$.cli.ok("Watching for file changes")
        const server: express.Application = express();
        this.$.renderer.param.externals.forEach(external =>//externals
            server.use(`${this.$.rel.libRel}${external}`, express.static(join(this.$.config.paths.dist, this.$.rel.libRel, external))));

        if (this.$.config.paths.static)
            server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));

        server.use((req, res, next) => {
            req.url = decodeURI(req.url);
            if (req.url.startsWith("/" + this.$.rel.mapRel + "/"))
                this.getPageMap(req, res);
            else if (req.url.startsWith("/" + this.$.rel.libRel + "/"))
                this.getLib(req, res);
            else
                this.getPage(req, res)
            next();
        });
        server.listen(5000, _ => {
            this.$.cli.ok("listening on port 5000");
        })
    }

    private getPageMap(req: express.Request, res: express.Response) {
        let found = false;
        const path = req.url.substring(("/" + this.$.rel.mapRel).length, req.url.lastIndexOf(".map.js"));
        console.log(path)
        for (const page of this.$.pageMap.values())
            if ((found = page.plugin.paths.some(_path => path === _path))) {
                res.end(`window.__MAP__=${page.plugin.getContent(path)}`)
                break;
            }
        if (!found)
            res.status(404);
    }

    private buildPage(page_path: string) {
        const page = this.$.pageMap.get(page_path.substring((this.$.config.paths.pages + "/").length));
        this.$.pageArchitect.buildDirect(page, async () => {
            this.$.cli.ok(`Successfully built page ${page.toString()}`);
            await page.plugin.initPaths();
        }, err => {
            this.$.cli.error(`Error while building page ${page.toString()}`, err);
        });
    }

    private getLib(req: express.Request, res: express.Response) {
        let found = false;
        let cleanUrl = "/" + req.url.substring(("/" + this.$.rel.libRel).length);
        for (const page of this.$.pageMap.values()) {
            if ((found = this.$.outputFileSystem.existsSync(cleanUrl))) {
                res.end(this.$.outputFileSystem.readFileSync(cleanUrl));
                break;
            }
        }
        if (!found)
            res.status(404);
    }

    private getPage(req: express.Request, res: express.Response) {
        let found = false;
        for (const page of this.$.pageMap.values()) {
            if ((found = page.plugin.paths.some(path => {
                if (req.url === path || (join(req.url, "index") === path)) {
                    res.end(this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, undefined)))
                    return true;
                }
            }))) break;
        }
        if (!found) {
            const page404 = this.$.pageMap.get(this.$.config.pages["404"]);
            console.log(page404)
            if (this.$.outputFileSystem.existsSync(page404.plugin.paths[0]))
                res.end(this.$.renderer.finalize(this.$.renderer.render(this.$.template, page404, page404.plugin.paths[0], undefined)))
            else
                res.end("Please Wait...")
        }
    }
}