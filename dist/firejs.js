#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const server_1 = require("./server");
const fs_1 = require("fs");
const path_1 = require("path");
const app = new index_1.default();
if (app.Context.config.pro)
    app.buildPro(() => {
        const $ = app.Context;
        $.cli.ok("Build finished");
        $.cli.log("Generating babel chunk map");
        const babel_map = {};
        for (const mapComponent of $.map.values()) {
            babel_map[mapComponent.Page] = mapComponent.babelChunk;
        }
        fs_1.writeFileSync(path_1.join($.config.paths.out, "babel.map.json"), JSON.stringify(babel_map));
        $.cli.ok("DONE");
    });
else {
    new server_1.default(app);
}
