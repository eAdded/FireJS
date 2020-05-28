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
        server.get(`/${this.$.rel.mapRel}/*`, this.get.bind(this))
        server.get(`/${this.$.rel.libRel}/*`, this.get.bind(this))
        server.get('*', this.getPage.bind(this));
        server.listen(process.env.PORT || 5000, () => {
            this.$.cli.ok(`listening on port ${process.env.PORT || "5000"}`);
        })
    }

    private get(req: express.Request, res: express.Response) {
        // @ts-ignore
        const path = join(this.$.config.paths.dist, decodeURI(req._parsedUrl.pathname));
        console.log("get", path)
        console.log(this.$.outputFileSystem.data.media.dedsec.Data.Projects.temp["fire-js-impl"].out.dist.lib)
        if (this.$.outputFileSystem.existsSync(path))
            res.end(this.$.outputFileSystem.readFileSync(path));
        else
            res.status(404);
    }

    private getPage(req: express.Request, res: express.Response) {
        // @ts-ignore
        let path = join(this.$.config.paths.dist, decodeURI(req._parsedUrl.pathname));
        console.log("getPage", path)
        if (this.$.outputFileSystem.existsSync(join(path, "index.html")))
            res.end(this.$.outputFileSystem.readFileSync(join(path, "index.html")));
        else if (this.$.outputFileSystem.existsSync(path + ".html"))
            res.end(this.$.outputFileSystem.readFileSync(path + ".html"));
        else
            res.end(this.$.outputFileSystem.readFileSync(join(this.$.config.paths.dist, this.$.pageMap.get(this.$.config.pages["404"]).plugin.paths[0]) + ".html"));
    }
}