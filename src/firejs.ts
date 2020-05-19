#!/usr/bin/env node
import FireJS from "./index"
import Server from "./server"
import {writeFileSync} from "fs"
import {join} from "path"

const app = new FireJS();
if (app.Context.config.pro)
    app.buildPro(() => {
        const $ = app.Context;
        $.cli.ok("Build finished");
        $.cli.log("Generating babel chunk map");
        const babel_map = {};
        for (const mapComponent of $.map.values()) {
            babel_map[mapComponent.Page] = mapComponent.babelChunk;
        }
        writeFileSync(join($.config.paths.out, "babel.map.json"), JSON.stringify(babel_map));
        $.cli.ok("DONE");
    });
else {
    new Server(app);
}