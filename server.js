const express = require("express");
const FireJS = require("./index");
const server = express();
const app = new FireJS({});
const _path = require("path");
app.build().then(
    () => {
        const staticArchitect = app.newStaticArchitect();
        server.use("/lib", (req, res, next) => {
            let found = false;
            app.getMap().forEach(value => {
                for(const assetName in value.stat.compilation.assets){
                    console.log(req.url,assetName);
                    if(req.url === assetName){
                        found = true;
                        res.write(value.stat.compilation.assets[assetName]);
                        next();
                    }

                }
            })
            if (!found)
                res.status(404);
        })
        server.use((req, res, next) => {
            if (!req.url.startsWith("/lib/")) {
                let found = false;
                app.getMap().forEach(value => {
                    value.getPaths().forEach(path => {
                        if (path.getPath() === req.url) {
                            found = true;
                            res.send(staticArchitect.finalize(staticArchitect.render(value, path)));
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