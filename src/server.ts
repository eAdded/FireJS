import {join, relative} from "path"
import {watch} from "chokidar"
import StaticArchitect from "./architects/StaticArchitect"
import PageArchitect from "./architects/PageArchitect"
import MapComponent from "./classes/MapComponent"
import FireJS from "./index"
import {applyPlugin} from "./mappers/PluginMapper";
import express = require("express");

const server: express.Application = express();

export default function (app: FireJS) {
    const $ = app.Context;
    const {config: {paths}} = $;
    const staticArchitect = new StaticArchitect($);
    const pageArchitect = new PageArchitect($);
    const pageDataRelative = `/${relative(paths.dist, paths.map)}/`;
    const libRelative = `/${relative(paths.dist, paths.lib)}/`;

    app.mapPluginsAndBuildExternals().then(_ => {
        watch(paths.pages)//watch changes
            .on('add', buildPage)
            .on('unlink', path => {
                $.map.delete(path.replace(paths.pages + "/", ""));
            });
        $.externals.forEach(external =>//externals
            server.use(`${libRelative}${external}`, express.static(join(paths.dist, libRelative, external))));
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

    function getPageData(req: express.Request, res: express.Response) {
        let found = false;
        for (const mapComponent of $.map.values()) {
            if ((found = mapComponent.paths.some(pagePath => {
                if (req.url === `/${pagePath.MapPath}`) {
                    res.end(`window.__MAP__=${JSON.stringify(pagePath.Map)}`);
                    return true;
                }
            }))) break;
        }
        if (!found)
            res.status(404);
    }

    function getLib(req: express.Request, res: express.Response) {
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

    function getPage(req: express.Request, res: express.Response) {
        let found = false;
        for (const mapComponent of $.map.values()) {
            if ((found = mapComponent.paths.some(pagePath => {
                if (req.url === pagePath.Path || (join(req.url, "index") === pagePath.Path)) {
                    res.end(staticArchitect.finalize(staticArchitect.render(mapComponent.chunkGroup, pagePath, false)));
                    return true;
                }
            }))) break;
        }
        if (!found) {
            const _404_MapComponent = $.map.get($.config.pages["404"]);
            if (_404_MapComponent.paths.length > 0)
                res.end(staticArchitect.finalize(staticArchitect.render(_404_MapComponent.chunkGroup, _404_MapComponent.paths[0], false)));
            else
                res.end("Please Wait...")
        }
    }

    function buildPage(path: string) {
        const rel_page = path.replace(paths.pages + "/", "")
        let mapComponent: MapComponent = $.map.get(rel_page);
        if (!mapComponent) {
            mapComponent = new MapComponent(rel_page);
            $.map.set(rel_page, mapComponent);
        }
        pageArchitect.buildDirect(mapComponent, () => {
            $.cli.ok(`Successfully built page ${mapComponent.Page}`);
            applyPlugin(mapComponent, $.rel, () => {
            });
        }, err => {
            $.cli.error(`Error while building page ${mapComponent.Page}`, err);
        });
    }
}