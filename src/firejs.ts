#!/usr/bin/env node
import FireJS from "./index"
import Server from "./server"
import {writeFileSync} from "fs"
import {join} from "path"

const app = new FireJS();
if (app.Context.config.pro)
    app.buildPro(() => {
        const $ = app.Context
        $.cli.ok("Build finished");
        $.cli.log("Generating babel chunk map");
        writeFileSync(join($.config.paths.out, "firejs.map.json"), JSON.stringify(app.generateMap()));
    });
else {
    new Server(app);
}