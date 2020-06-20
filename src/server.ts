import {join} from "path"
import {watch} from "chokidar"
import FireJS, {$} from "./FireJS"
import Page from "./classes/Page";
import express = require("express");

export default class {
    private readonly $: $
    private readonly app: FireJS;

    constructor(app: FireJS) {
        this.app = app;
        this.$ = app.getContext();
        this.$.pageArchitect.webpackArchitect.defaultConfig.watch = true;
    }

    async init() {
        //init server
        const server: express.Application = express();
        //init plugins
        this.$.globalPlugins.forEach(plugin => plugin.initServer(server))
        //watch changes
        this.$.cli.ok("Watching for file changes")
        watch(this.$.config.paths.pages)
            .on('add', path => {
                path = path.replace(this.$.config.paths.pages + "/", "");
                const page = this.$.pageMap.get(path) || new Page(path);
                this.$.pageMap.set(page.toString(), page);
                this.app.buildPage(page, () => {
                    }, (e) =>
                        this.$.cli.error(`Error while rendering page ${page.toString()}\n`, e)
                );
            })
            .on('unlink', path => {
                const page = this.$.pageMap.get(path.replace(this.$.config.paths.pages + "/", ""));
                page.chunks.forEach(chunk => {
                    this.$.outputFileSystem.unlinkSync(join(this.$.config.paths.lib, chunk));
                })
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
        //routing
        if (this.$.config.paths.static)
            server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));
        server.get(`/${this.$.rel.mapRel}/*`, this.get.bind(this))
        server.get(`/${this.$.rel.libRel}/*`, this.get.bind(this))
        server.get('*', this.getPage.bind(this));
        //listen
        server.listen(process.env.PORT || 5000, () => this.$.cli.ok(`listening on port ${process.env.PORT || "5000"}`))
    }

    private get(req: express.Request, res: express.Response) {
        // @ts-ignore
        const pathname = join(this.$.config.paths.dist, decodeURI(req._parsedUrl.pathname));
        if (this.$.outputFileSystem.existsSync(pathname))
            res.write(this.$.outputFileSystem.readFileSync(pathname));
        else
            res.status(404);
        res.end();
    }

    private getPage(req: express.Request, res: express.Response) {
        // @ts-ignore
        const pathname = decodeURI(req._parsedUrl.pathname);
        try {
            let path = join(this.$.config.paths.dist, pathname);
            if (this.$.outputFileSystem.existsSync(join(path, "index.html")))
                res.end(this.$.outputFileSystem.readFileSync(join(path, "index.html")));
            else if (this.$.outputFileSystem.existsSync(path + ".html"))
                res.end(this.$.outputFileSystem.readFileSync(path + ".html"))
            else {
                const _404 = this.$.pageMap.get(this.$.config.pages["404"]).toString();
                res.end(this.$.outputFileSystem.readFileSync(join(this.$.config.paths.dist, _404.substring(0, _404.lastIndexOf(".")) + ".html")));
            }
        } catch (e) {
            this.$.cli.error("Error serving " + pathname);
            res.status(500);
        }
    }
}