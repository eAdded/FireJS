const express = require("express");
const FireJS = require("./index");
const server = express();
const app = new FireJS({});
const _path = require("path");
app.build().then(
    () => {
        const staticArchitect = app.newStaticArchitect();
        server.use("/lib",express.static(app.getConfig().paths.lib))
        server.use((req, res, next) => {
            console.log(req.url);
            if (!req.url.startsWith("/lib/")) {
                let found = false;
                app.getMap().forEach(value => {
                    value.getPaths().forEach(path => {
                        if (path.getPath() === req.url) {
                            found = true;
                            res.send(staticArchitect.finalize(staticArchitect.render(value, path)));
                            console.log("got it");
                            next();
                        }
                    })
                })
                if (!found)
                    res.status(404);
            }
        })
        server.listen(5000, _ => {
            console.log("listening on port 5000");
        })
    }
);