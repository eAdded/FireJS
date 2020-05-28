"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const chokidar_1 = require("chokidar");
const Page_1 = require("./classes/Page");
const MemoryFS = require("memory-fs");
const express = require("express");
class default_1 {
    constructor(app) {
        this.app = app;
        this.$ = app.getContext();
        this.$.outputFileSystem = new MemoryFS();
        this.$.pageArchitect.isOutputCustom = true;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.init();
            chokidar_1.watch(this.$.config.paths.pages) //watch changes
                .on('add', path => {
                path = path.replace(this.$.config.paths.pages + "/", "");
                const page = this.$.pageMap.get(path) || new Page_1.default(path);
                this.$.pageMap.set(page.toString(), page);
                this.app.buildPage(page);
            })
                .on('unlink', path => {
                const page = this.$.pageMap.get(path.replace(this.$.config.paths.pages + "/", ""));
                page.chunks.forEach(chunk => {
                    this.$.outputFileSystem.unlinkSync(path_1.join(this.$.config.paths.lib, chunk));
                });
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
            this.$.cli.ok("Watching for file changes");
            const server = express();
            if (this.$.config.paths.static)
                server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));
            server.use(`/${this.$.rel.libRel}/i21345bb373762325b784.js`, express.static(path_1.join(__dirname, "../web/dist/i21345bb373762325b784.js")));
            server.get(`/${this.$.rel.mapRel}/*`, this.get.bind(this));
            server.get(`/${this.$.rel.libRel}/*`, this.get.bind(this));
            server.get('*', this.getPage.bind(this));
            server.listen(process.env.PORT || 5000, () => {
                this.$.cli.ok(`listening on port ${process.env.PORT || "5000"}`);
            });
        });
    }
    get(req, res) {
        // @ts-ignore
        const path = path_1.join(this.$.config.paths.dist, decodeURI(req._parsedUrl.pathname));
        if (this.$.outputFileSystem.existsSync(path))
            res.end(this.$.outputFileSystem.readFileSync(path));
        else
            res.status(404);
    }
    getPage(req, res) {
        // @ts-ignore
        let path = path_1.join(this.$.config.paths.dist, decodeURI(req._parsedUrl.pathname));
        if (this.$.outputFileSystem.existsSync(path_1.join(path, "index.html")))
            res.end(this.$.outputFileSystem.readFileSync(path_1.join(path, "index.html")));
        else if (this.$.outputFileSystem.existsSync(path + ".html"))
            res.end(this.$.outputFileSystem.readFileSync(path + ".html"));
        else
            res.end(this.$.outputFileSystem.readFileSync(path_1.join(this.$.config.paths.dist, this.$.pageMap.get(this.$.config.pages["404"]).plugin.paths[0]) + ".html"));
    }
}
exports.default = default_1;
