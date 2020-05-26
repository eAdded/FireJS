import {join} from "path"
import {watch} from "chokidar"
import FireJS, {$} from "./FireJS"
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
        this.$.cli.ok("Watching for file changes")
        const server: express.Application = express();
        this.$.renderer.param.externals.forEach(external =>//externals
            server.get(`${this.$.rel.libRel}${external}`, (req, res) => {
                res.end(this.$.outputFileSystem.readFileSync(req.path));
            }));

        if (this.$.config.paths.static)
            server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));

        server.use((req, res, next) => {
            // @ts-ignore
            const path = decodeURI(req._parsedUrl.pathname);
            if (path.startsWith("/" + this.$.rel.mapRel + "/"))
                this.getPageMap(path, res, next);
            else if (path.startsWith("/" + this.$.rel.libRel + "/"))
                this.getLib(path, res, next);
            else
                this.getPage(path, req, res, next)
        });
        server.listen(process.env.PORT || 5000, () => {
            this.$.cli.ok(`listening on port ${process.env.PORT || "5000"}`);
        })
    }

    private getPageMap(path: string, res: express.Response, next) {
        let found = false;
        path = path.substring(("/" + this.$.rel.mapRel).length, path.lastIndexOf(".map.js"));
        for (const page of this.$.pageMap.values())
            if ((found = page.plugin.paths.some(_path => path === _path))) {
                (async () => {
                    res.end(`window.__MAP__=${JSON.stringify({
                        content: await page.plugin.getContent(path),
                        chunks: page.chunkGroup.chunks
                    })}`)
                    next();
                })()
                break;
            }
        if (!found) {
            res.status(404);
            next();
        }
    }

    private buildPage(page_path: string) {
        const page = this.$.pageMap.get(page_path.substring((this.$.config.paths.pages + "/").length));
        this.$.pageArchitect.buildDirect(page, () => {
            page.chunkGroup.chunks.forEach(chunk => {
                this.$.outputFileSystem.unlinkSync(`/${this.$.rel.libRel}/${chunk}`)
            })
            page.chunkGroup.chunks = [];//reinit chunks
            this.$.cli.ok(`Successfully built page ${page.toString()}`);
            page.plugin.initPaths();
        }, err => {
            this.$.cli.error(`Error while building page ${page.toString()}`, err);
        });
    }

    private getLib(path: string, res: express.Response, next) {
        let found = false;
        for (const page of this.$.pageMap.values()) {
            if ((found = this.$.outputFileSystem.existsSync(path))) {
                res.end(this.$.outputFileSystem.readFileSync(path));
                break;
            }
        }
        if (!found)
            res.status(404);
        next();
    }

    private getPage(path: string, req: express.Request, res: express.Response, next) {
        let found = false;
        for (const page of this.$.pageMap.values()) {
            if ((found = page.plugin.paths.some(_path => {
                if (path === _path || (join(path, "index") === _path)) {
                    (async () => {
                        await page.plugin.onRequest(req, res);
                        res.end(this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, undefined)))
                        next();
                    })()
                    return true;
                }
            }))) break;
        }
        if (!found) {
            const page404 = this.$.pageMap.get(this.$.config.pages["404"]);
            if (this.$.outputFileSystem.existsSync("/" + this.$.rel.libRel + "/" + page404.chunkGroup.chunks[0]))
                res.end(this.$.renderer.finalize(this.$.renderer.render(this.$.template, page404, page404.plugin.paths[0], undefined)))
            else
                res.end("Please Wait...")
            next();
        }
    }
}