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
                .on('add', this.buildPage.bind(this))
                .on('unlink', path => {
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
            this.$.cli.ok("Watching for file changes");
            const server = express();
            this.$.renderer.param.externals.forEach(external => //externals
             server.get(`${this.$.rel.libRel}${external}`, (req, res) => {
                res.end(this.$.outputFileSystem.readFileSync(req.url));
            }));
            if (this.$.config.paths.static)
                server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));
            server.use((req, res, next) => {
                req.url = decodeURI(req.url);
                if (req.url.startsWith("/" + this.$.rel.mapRel + "/"))
                    this.getPageMap(req, res);
                else if (req.url.startsWith("/" + this.$.rel.libRel + "/"))
                    this.getLib(req, res);
                else
                    this.getPage(req, res);
                next();
            });
            server.listen(5000, _ => {
                this.$.cli.ok("listening on port 5000");
            });
        });
    }
    getPageMap(req, res) {
        let found = false;
        const path = req.url.substring(("/" + this.$.rel.mapRel).length, req.url.lastIndexOf(".map.js"));
        for (const page of this.$.pageMap.values())
            if ((found = page.plugin.paths.some(_path => path === _path))) {
                (() => __awaiter(this, void 0, void 0, function* () {
                    res.end(`window.__MAP__=${JSON.stringify({
                        content: yield page.plugin.getContent(path),
                        chunks: page.chunkGroup.chunks
                    })}`);
                }))();
                break;
            }
        if (!found)
            res.status(404);
    }
    buildPage(page_path) {
        const page = this.$.pageMap.get(page_path.substring((this.$.config.paths.pages + "/").length));
        this.$.pageArchitect.buildDirect(page, () => {
            page.chunkGroup.chunks.forEach(chunk => {
                this.$.outputFileSystem.unlinkSync(`/${this.$.rel.libRel}/${chunk}`);
            });
            page.chunkGroup.chunks = []; //reinit chunks
            console.log(this.$.outputFileSystem);
            this.$.cli.ok(`Successfully built page ${page.toString()}`);
            page.plugin.initPaths();
        }, err => {
            this.$.cli.error(`Error while building page ${page.toString()}`, err);
        });
    }
    getLib(req, res) {
        let found = false;
        for (const page of this.$.pageMap.values()) {
            if ((found = this.$.outputFileSystem.existsSync(req.url))) {
                res.end(this.$.outputFileSystem.readFileSync(req.url));
                break;
            }
        }
        if (!found)
            res.status(404);
    }
    getPage(req, res) {
        let found = false;
        for (const page of this.$.pageMap.values()) {
            if ((found = page.plugin.paths.some(path => {
                if (req.url === path || (path_1.join(req.url, "index") === path)) {
                    res.end(this.$.renderer.finalize(this.$.renderer.render(this.$.template, page, path, undefined)));
                    return true;
                }
            })))
                break;
        }
        if (!found) {
            const page404 = this.$.pageMap.get(this.$.config.pages["404"]);
            if (this.$.outputFileSystem.existsSync(page404.plugin.paths[0]))
                res.end(this.$.renderer.finalize(this.$.renderer.render(this.$.template, page404, page404.plugin.paths[0], undefined)));
            else
                res.end("Please Wait...");
        }
    }
}
exports.default = default_1;
