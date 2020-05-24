#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const server_1 = require("./server");
const path_1 = require("path");
const startTime = new Date().getTime();
const app = new index_1.default();
const $ = app.getContext();
if ($.config.pro) {
    app.buildPro().then(() => {
        $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
        $.cli.log("Generating babel chunk map");
        const map = {
            staticConfig: $.renderer.param,
            pageMap: {},
            template: $.template
        };
        for (const page of $.pageMap.values())
            map.pageMap[page.toString()] = page.chunkGroup;
        $.outputFileSystem.writeFileSync(path_1.join($.config.paths.babel, "firejs.map.json"), JSON.stringify(map));
        $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
    });
}
else
    new server_1.default(app);
