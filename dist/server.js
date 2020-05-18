"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const chokidar_1 = require("chokidar");
const StaticArchitect_1 = require("./architects/StaticArchitect");
const PageArchitect_1 = require("./architects/PageArchitect");
const MapComponent_1 = require("./classes/MapComponent");
const PagePath_1 = require("./classes/PagePath");
const PluginMapper_1 = require("./mappers/PluginMapper");
const express = require("express");
const server = express();
function default_1(app) {
    const $ = app.getContext();
    const { config: { paths } } = $;
    const staticArchitect = new StaticArchitect_1.default($);
    const pageArchitect = new PageArchitect_1.default($);
    const pluginMapper = new PluginMapper_1.default($);
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
                    res.end(staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath)));
                    return true;
                }
            })))
                break;
        }
        if (!found) {
            const _404_MapComponent = $.map.get($.config.pages._404);
            if (_404_MapComponent.paths.length > 0)
                res.end(staticArchitect.finalize(staticArchitect.render(_404_MapComponent, _404_MapComponent.paths[0])));
            else
                res.end("Please Wait...");
        }
    }
    function buildPage(path) {
        const rel_page = path.replace(paths.pages + "/", "");
        let mapComponent = $.map.get(rel_page);
        if (!mapComponent) {
            mapComponent = new MapComponent_1.default(rel_page);
            $.map.set(rel_page, mapComponent);
        }
        pageArchitect.buildDirect(mapComponent, () => {
            let path = mapComponent.Page;
            path = "/" + path.substring(0, path.lastIndexOf(".js"));
            mapComponent.paths.push(new PagePath_1.default(mapComponent, path, undefined, $));
            pluginMapper.applyPlugin(mapComponent);
            $.cli.ok(`Successfully built page ${mapComponent.Page}`);
        }, err => {
            $.cli.error(`Error while building page ${mapComponent.Page}`, err);
        });
    }
}
exports.default = default_1;
