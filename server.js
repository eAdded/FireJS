const _path = require("path");
const express = require("express");
const chokidar = require("chokidar");
const StaticArchitect = require("./architects/static.architect");
const PageArchitect = require("./architects/page.architect");
const MapComponent = require("./classes/MapComponent");
const PagePath = require("./classes/PagePath");
const PluginMapper = require("./mappers/plugin.mapper");
const server = express();

module.exports = (app) => {
    const $ = app.getContext();
    const {config: {paths}} = $;
    const staticArchitect = new StaticArchitect($)
    const pageArchitect = new PageArchitect($);
    const pluginMapper = new PluginMapper($);
    const pageDataRelative = `/${_path.relative(paths.dist, paths.pageData)}/`;
    const libRelative = `/${_path.relative(paths.dist, paths.lib)}/`;

    app.mapPluginsAndBuildExternals().then(_ => {
        chokidar.watch(paths.pages)//watch changes
            .on('add', buildPage)
            .on('unlink', path => {
                const rel_page = path.replace(paths.pages + "/", "")
                $.map.delete(rel_page);
            });
        $.externals.forEach(external =>//externals
            server.use(`${libRelative}${external}`, express.static(_path.join(paths.dist, libRelative, external))));
        server.use((req, res, next) => {
            if (req.url.startsWith(pageDataRelative)) {
                getPageData(req, res);
            } else if (req.url.startsWith(libRelative)) {
                getLib(req, res);
            } else {
                getPage(req, res)
            }
            next();
        });
        server.listen(5000, _ => {
            $.cli.ok("listening on port 5000");
        })
    })

    function getPageData(req, res) {
        let found = false;
        $.map.forEach(mapComponent => {
            for (const pagePath of mapComponent.paths) {
                if (req.url === `/${pagePath.getContentPath()}`) {
                    found = true;
                    res.end("window.___PAGE_CONTENT___=".concat(JSON.stringify(pagePath.getContent())));
                }
            }
        })
        if (!found)
            res.status(404);
    }

    function getLib(req, res) {
        let found = false;
        $.map.forEach(mapComponent => {
            for (const assetName in mapComponent.stat.compilation.assets) {
                if (req.url === _path.join(libRelative, mapComponent.getDir(), assetName)) {
                    found = true;
                    res.end(mapComponent.stat.compilation.assets[assetName]._value);
                }
            }
        })
        if (!found)
            res.status(404);
    }

    function getPage(req, res) {
        let found = false;
        $.map.forEach(mapComponent => {
            for (const pagePath of mapComponent.paths) {
                if (req.url === pagePath.getPath() || (_path.join(req.url, "index") === pagePath.getPath())) {
                    found = true;
                    res.end(staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath)));
                }
            }
        })
        if (!found)
            res.status(404);
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
            mapComponent.paths.push(new PagePath(path, undefined, $));
            pluginMapper.applyPlugin(mapComponent);
            $.cli.ok(`Successfully built page ${mapComponent.getPage()}`);
        }, err => {
            $.cli.error(`Error while building page ${mapComponent.getPage()}`,err);
        });
    }
}