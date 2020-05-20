#!/usr/bin/env node
import FireJS from "./index"
import Server from "./server"
import {writeFileSync} from "fs"
import {join} from "path"

const startTime = new Date().getTime();
const app = new FireJS();

if (app.Context.config.pro) {
    app.buildPro(() => {
        const $ = app.Context
        $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
        $.cli.log("Generating babel chunk map");
        writeFileSync(join($.config.paths.out, "CHUNK_MAP.json"), JSON.stringify(app.generateMap()));
        $.cli.log("Writing config cache map");
        writeFileSync(join($.config.paths.out, "STATIC_CONFIG.json"), JSON.stringify({
            rel: $.rel,
            tags: $.config.templateTags,
            pages: $.config.pages,
            template: $.template,
            babelPath: $.config.templateTags
        }));
        $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
    });
} else
    new Server(app);