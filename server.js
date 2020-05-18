const _path = require("path");
const express = require("express");
const chokidar = require("chokidar");
const StaticArchitect = require("./src/architects/static.architect");
const PageArchitect = require("./src/architects/page.architect");
const MapComponent = require("./src/classes/MapComponent");
const PagePath = require("./src/classes/PagePath");
const PluginMapper = require("./src/mappers/plugin.mapper");
const server = express();

module.exports = (app) => {
    const $ = app.getContext();
    const {config: {paths}} = $;
    const staticArchitect = new StaticArchitect($)
    const pageArchitect = new PageArchitect($);
    const pluginMapper = new PluginMapper($);
    const pageDataRelative = `/${_path.relative(paths.dist, paths.map)}/`;
    const libRelative = `/${_path.relative(paths.dist, paths.lib)}/`;

    app.mapPluginsAndBuildExternals().then(_ => {
        chokidar.watch(paths.pages)//watch changes
            .on('add', buildPage)
            .on('unlink', path => {
                $.map.delete(path.replace(paths.pages + "/", ""));
            });
        $.externals.forEach(external =>//externals
            server.use(`${libRelative}${external}`, express.static(_path.join(paths.dist, libRelative, external))));
        if (paths.static)
            server.use(`${paths.static.substring(paths.static.lastIndexOf("/"))}`, express.static(paths.static));
        server.use((req, res, next) => {
            req.url = decodeURI(req.url);
            if (req.url.startsWith(pageDataRelative))
                getPageData(req, res);
            else if (req.url.startsWith(libRelative))
                getLib(req, res);
            else
                getPage(req, res)
            next();
        });
        server.listen(5000, _ => {
            $.cli.ok("listening on port 5000");
        })
    })

    function getPageData(req, res) {
        let found = false;
        for (const mapComponent of $.map.values()) {
            if ((found = mapComponent.paths.some(pagePath => {
                if (req.url === `/${pagePath.getMapPath()}`) {
                    res.end(`window.__MAP__=${JSON.stringify(pagePath.getMap())}`);
                    return true;
                }
            }))) break;
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
                if (req.url === pagePath.getPath() || (_path.join(req.url, "index") === pagePath.getPath())) {
                    res.end(staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath)));
                    return true;
                }
            }))) break;
        }
        if (!found) {
            const _404_MapComponent = $.map.get($.config.pages._404);
            res.end(staticArchitect.finalize(staticArchitect.render(_404_MapComponent, _404_MapComponent.paths[0])));
        }
    }

    function buildPage(path) {
        const rel_page = path.replace(paths.pages + "/", "")
        let mapComponent = $.map.get(rel_page);
        if (!mapComponent) {
            mapComponent = new MapComponent(rel_page);
            $.map.set(rel_page, mapComponent);
        }
        pageArchitect.buildDirect(mapComponent, _ => {
            let path = mapComponent.getPage();
            path = "/" + path.substring(0, path.lastIndexOf(".js"));
            mapComponent.paths.push(new PagePath(mapComponent, path, undefined, $));
            pluginMapper.applyPlugin(mapComponent);
            $.cli.ok(`Successfully built page ${mapComponent.getPage()}`);
        }, err => {
            $.cli.error(`Error while building page ${mapComponent.getPage()}`, err);
        });
    }
}