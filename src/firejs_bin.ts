#!/usr/bin/env node
import FireJS, {FIREJS_MAP} from "./FireJS"
import Server from "./server"
import {join} from "path"

(async function () {
    const startTime = new Date().getTime();
    const app = new FireJS();
    const $ = app.getContext();
    if ($.config.pro) {
        try {
            await app.init();
            await app.buildPro();
            $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
            $.cli.log("Generating babel chunk map");
            const map: FIREJS_MAP = {
                staticConfig: $.renderer.param,
                pageMap: {},
                template: $.template
            }
            for (const page of $.pageMap.values())
                map.pageMap[page.toString()] = page.chunkGroup
            $.outputFileSystem.writeFileSync(join($.config.paths.babel, "firejs.map.json"),
                JSON.stringify(map));
            $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
            if ($.config.paths.static)
                $.cli.warn("Don't forget to copy the static folder to dist");
        } catch (err) {
            $.cli.error(err)
        }
    } else {
        const server = new Server(app);
        await server.init();
    }
})()