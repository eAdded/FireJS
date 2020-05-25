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
const express = require("express");
const server = express();
function default_1(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = app.getContext();
        const { config: { paths } } = $;
        const pageDataRelative = `/${path_1.relative(paths.dist, paths.map)}/`;
        const libRelative = `/${path_1.relative(paths.dist, paths.lib)}/`;
        chokidar_1.watch(paths.pages) //watch changes
            .on('add', buildPage)
            .on('unlink', path => {
            $.pageMap.delete(path.replace(paths.pages + "/", ""));
        });
        $.renderer.param.externals.forEach(external => //externals
         server.use(`${libRelative}${external}`, express.static(path_1.join(paths.dist, libRelative, external))));
        if (paths.static)
            server.use(`${paths.static.substring(paths.static.lastIndexOf("/"))}`, express.static(paths.static));
        server.use((req, res, next) => {
            req.url = decodeURI(req.url);
            if (req.url.startsWith(pageDataRelative))
                getPageData(req, res);
            else if (req.url.startsWith(libRelative))
                getLib(req, res);
            else
                getPage(req, res);
            next();
        });
        server.listen(5000, _ => {
            $.cli.ok("listening on port 5000");
        });
        function getPageData(req, res) {
            let found = false;
            for (const mapComponent of $.map.values()) {
                if ((found = mapComponent.paths.some(pagePath => {
                    if (req.url === `/${pagePath.MapPath}`) {
                        res.end(`window.__MAP__=${JSON.stringify(pagePath.Map)}`);
                        return true;
                    }
                })))
                    break;
            }
            if (!found)
                res.status(404);
        }
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
        function buildPage(path) {
            const rel_page = path.replace(paths.pages + "/", "");
            let mapComponent = $.map.get(rel_page);
            if (!mapComponent) {
                mapComponent = new Page_1.default(rel_page);
                $.map.set(rel_page, mapComponent);
            }
            pageArchitect.buildDirect(mapComponent, () => {
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
    });
}
exports.default = default_1;
