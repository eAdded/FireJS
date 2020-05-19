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
        fs_1.writeFileSync(path_1.join($.config.paths.out, "firejs.map.json"), JSON.stringify(app.generateMap()));
    });
else {
    new server_1.default(app);
}
