import {join} from "path"
import {watch} from "chokidar"
import FireJS, {$} from "./FireJS"
import Page from "./classes/Page";
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
            .on('add', path => {
                path = path.replace(this.$.config.paths.pages + "/", "");
                const page = this.$.pageMap.get(path) || new Page(path);
                this.$.pageMap.set(page.toString(), page);
                this.app.buildPage(page);
            })
            .on('unlink', path => {
                const page = this.$.pageMap.get(path.replace(this.$.config.paths.pages + "/", ""));
                page.chunks.forEach(chunk => {
                    this.$.outputFileSystem.unlinkSync(join(this.$.config.paths.lib, chunk));
                })
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
        this.$.cli.ok("Watching for file changes")
        const server: express.Application = express();

        if (this.$.config.paths.static)
            server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));
        server.use(`/${this.$.rel.libRel}/i21345bb373762325b784.js`, express.static(join(__dirname, "../web/dist/i21345bb373762325b784.js")));
        server.get(`/${this.$.rel.libRel}/*`, this.get.bind(this))
        server.use('*', this.use.bind(this));
        server.listen(process.env.PORT || 5000, () => {
            this.$.cli.ok(`listening on port ${process.env.PORT || "5000"}`);
        })
    }

    private get(req: express.Request, res: express.Response) {
        // @ts-ignore
        this.getFromFileSystem(join(this.$.config.paths.dist, decodeURI(req._parsedUrl.pathname)), res)
        res.end();
    }

    private getFromFileSystem(path, res: express.Response) {
        if (this.$.outputFileSystem.existsSync(path))
            res.write(this.$.outputFileSystem.readFileSync(path));
        else
            res.status(404);
    }

    private use(req: express.Request, res: express.Response, next) {
        // @ts-ignore
        const pathname = decodeURI(req._parsedUrl.pathname);
        let page: Page;
        if (pathname.startsWith(`/${this.$.rel.mapRel}/`)) {
            this.getFromFileSystem(pathname, res)
            page = this.searchPage(pathname.substring(0, pathname.lastIndexOf(".map.js")));
        } else
            page = this.searchPage(pathname);
        this.$.cli.ok(page.toString())
        page.plugin.onRequest(req, res);
        if (req.method === "GET") {
            let path = join(this.$.config.paths.dist, pathname);
            if (this.$.outputFileSystem.existsSync(join(path, "index.html")))
                res.write(this.$.outputFileSystem.readFileSync(join(path, "index.html")));
            else
                res.write(this.$.outputFileSystem.readFileSync(path + ".html"));
        }
        res.end();
        next();
    }

    private searchPage(pathname: string): Page {
        for (const page of this.$.pageMap.values()) {
            if (page.plugin.paths.has(pathname) || page.plugin.paths.has(join(pathname, "index")))
                return page;
        }
        return this.$.pageMap.get(this.$.config.pages["404"])
    }
}