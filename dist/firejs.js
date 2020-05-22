#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const server_1 = require("./server");
const fs_1 = require("fs");
const path_1 = require("path");
const startTime = new Date().getTime();
const app = new index_1.default();
if (app.Context.config.pro) {
    app.buildPro(() => {
        const $ = app.Context;
        $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
        $.cli.log("Generating babel chunk map");
        const map = {
            staticConfig: {
                rel: $.rel,
                tags: $.config.templateTags,
                pages: $.config.pages,
                externals: $.externals,
            },
            pageMap: {},
            template: $.template
        };
        for (const page of $.map.values())
            map.pageMap[page.Page] = page.chunkGroup;
        fs_1.writeFileSync(path_1.join($.config.paths.babel, "firejs.map.json"), JSON.stringify(map));
        $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
    });
}
else
    new server_1.default(app);
