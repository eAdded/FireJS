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
const index_1 = require("./index");
const Page_1 = require("./classes/Page");
const express = require("express");
class default_1 {
    constructor() {
        this.cacheMap = new Map();
        this.$ = (this.app = new index_1.default()).getContext();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this;
            this.$.cli.log("Caching data from plugins");
            chokidar_1.watch(this.$.config.paths.pages) //watch changes
                .on('add', this.buildPage)
                .on('unlink', path => {
                this.$.pageMap.delete(path.replace(this.$.config.paths.pages + "/", ""));
            });
            this.$.cli.ok("Watching for file changes");
            const server = express();
            this.$.renderer.param.externals.forEach(external => //externals
             server.use(`${this.$.rel.libRel}${external}`, express.static(path_1.join(this.$.config.paths.dist, this.$.rel.libRel, external))));
            if (this.$.config.paths.static)
                server.use(`${this.$.config.paths.static.substring(this.$.config.paths.static.lastIndexOf("/"))}`, express.static(this.$.config.paths.static));
            server.use((req, res, next) => {
                req.url = decodeURI(req.url);
                if (req.url.startsWith(this.$.rel.mapRel))
                    this.getPageMap(req, res);
                else if (req.url.startsWith(this.$.rel.libRel))
                    getLib(req, res);
                else
                    getPage(req, res);
                next();
            });
            server.listen(5000, _ => {
                this.$.cli.ok("listening on port 5000");
            });
        });
    }
    generatePageCache(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathMap = new Map();
            const promises = [];
            (yield page.plugin.getPaths()).forEach(path => {
                promises.push(() => __awaiter(this, void 0, void 0, function* () {
                    return pathMap.set(path, `window.__MAP__=${JSON.stringify({
                        content: yield page.plugin.getContent(path),
                        chunks: page.chunkGroup.chunks
                    })}`);
                }));
            });
            yield Promise.all(promises);
            return pathMap;
        });
    }
    getPageMap(req, res) {
        let found = false;
        const path = req.url.substring(0, req.url.lastIndexOf(".map.js"));
        for (const pathsMap of this.cacheMap.values()) {
            const pathMap = pathsMap.get(path);
            if (found = !!pathMap) {
                res.end(pathMap);
                break;
            }
        }
        if (!found)
            res.status(404);
    }
    buildPage(page_path) {
        const page = new Page_1.default(page_path = page_path.replace(this.$.config.paths.pages + "/", ""));
        page.plugin =
            this.$.pageArchitect.buildDirect().buildDirect(mapComponent, () => {
                let pathsMap = this.cacheMap.get(page_path);
                $.cli.ok(`Successfully built page ${mapComponent.Page}`);
                // @ts-ignore
                if (!mapComponent.wasApplied) {
                    // @ts-ignore
                    mapComponent.wasApplied = true;
                    $.cli.log(`Applying plugin for page ${mapComponent.Page}`);
                    applyPlugin(mapComponent, $.rel, (pagePath) => {
                        $.cli.ok(`Data fetched for path ${pagePath.Path}`);
                    });
                }
            }, err => {
                $.cli.error(`Error while building page ${mapComponent.Page}`, err);
            });
    }
}
exports.default = default_1;
function s(app) {
    return __awaiter(this, void 0, void 0, function* () {
        function getLib(req, res) {
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
        function getPage(req, res) {
            let found = false;
            for (const page of $.pageMap.values()) {
                if ((found = page.paths.some(pagePath => {
                    if (req.url === pagePath.Path || (path_1.join(req.url, "index") === pagePath.Path)) {
                        res.end($.renderer.finalize($.renderer.render($.template, mapComponent.chunkGroup, pagePath, false)));
                        return true;
                    }
                })))
                    break;
            }
            if (!found) {
                const _404_MapComponent = $.map.get($.config.pages["404"]);
                if (_404_MapComponent.paths.length > 0)
                    res.end(staticArchitect.finalize(staticArchitect.render($.template, _404_MapComponent.chunkGroup, _404_MapComponent.paths[0], false)));
                else
                    res.end("Please Wait...");
            }
        }
        function generateCache() {
        }
    });
}
exports.s = s;
