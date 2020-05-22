"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const chokidar_1 = require("chokidar");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const PageArchitect_1 = require("./architects/PageArchitect");
const Page_1 = require("./classes/Page");
const PluginMapper_1 = require("./mappers/PluginMapper");
const express = require("express");
const server = express();
function default_1(app) {
    const $ = app.Context;
    const { config: { paths } } = $;
    const staticArchitect = new StaticArchitect_1.default($);
    const pageArchitect = new PageArchitect_1.default($);
    const pageDataRelative = `/${path_1.relative(paths.dist, paths.map)}/`;
    const libRelative = `/${path_1.relative(paths.dist, paths.lib)}/`;
    app.mapPluginsAndBuildExternals().then(_ => {
        chokidar_1.watch(paths.pages) //watch changes
            .on('add', buildPage)
            .on('unlink', path => {
            $.map.delete(path.replace(paths.pages + "/", ""));
        });
        $.externals.forEach(external => //externals
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
        for (const mapComponent of $.map.values()) {
            if ((found = mapComponent.paths.some(pagePath => {
                if (req.url === pagePath.Path || (path_1.join(req.url, "index") === pagePath.Path)) {
                    res.end(staticArchitect.finalize(staticArchitect.render($.template, mapComponent.chunkGroup, pagePath, false)));
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
                PluginMapper_1.applyPlugin(mapComponent, $.rel, (pagePath) => {
                    $.cli.ok(`Data fetched for path ${pagePath.Path}`);
                });
            }
        }, err => {
            $.cli.error(`Error while building page ${mapComponent.Page}`, err);
        });
    }
}
exports.default = default_1;
