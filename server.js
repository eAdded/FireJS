const express = require("express");
const FireJS = require("./index");
const server = express();
const app = new FireJS({});
const _path = require("path");
const {paths} = app.getConfig();
const pageDataRelative = `/${_path.relative(paths.dist, paths.pageData)}/`;
const libRelative = `/${_path.relative(paths.dist, paths.lib)}/`;
const staticArchitect = app.newStaticArchitect();

app.build().then(
    () => {
        app.getExternals().forEach(external =>
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
            console.log("listening on port 5000");
        })
    }
);

function getPageData(req, res) {
    let found = false;
    app.getMap().forEach(mapComponent => {
        for (const pagePath of mapComponent.getPaths().values()) {
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
    app.getMap().forEach(mapComponent => {
        for (const assetName in mapComponent.stat.compilation.assets) {
            if (req.url === _path.join(libRelative, assetName)) {
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
    app.getMap().forEach(mapComponent => {
        for (const pagePath of mapComponent.getPaths().values()) {
            if (req.url === pagePath.getPath()) {
                found = true;
                res.end(staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath)));
            }
        }
    })
    if (!found)
        res.status(404);
}