#!/usr/bin/env node
import FireJS, {FIREJS_MAP} from "./index"
import Server from "./server"
import {writeFileSync} from "fs"
import {join} from "path"
import {StaticConfig} from "./architects/StaticArchitect";

const startTime = new Date().getTime();
const app = new FireJS();

if (app.Context.config.pro) {
    app.buildPro(() => {
        const $ = app.Context
        $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
        $.cli.log("Generating babel chunk map");
        const map: FIREJS_MAP = {
            staticConfig: <StaticConfig>{
                rel: $.rel,
                tags: $.config.templateTags,
                pages: $.config.pages,
                externals: $.externals,
            },
            pageMap: {},
            template: $.template
        }
        for (const page of $.map.values())
            map.pageMap[page.Page] = page.chunkGroup
        writeFileSync(join($.config.paths.babel, "firejs.map.json"),
            JSON.stringify(map));
        $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
    });
} else
    new Server(app);