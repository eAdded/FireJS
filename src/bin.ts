#!/usr/bin/env node
import FireJS, {FIREJS_MAP} from "./FireJS"
import Server from "./server"
import {join, resolve} from "path"
import {Args, getArgs} from "./mappers/ArgsMapper";

import ConfigMapper from "./mappers/ConfigMapper";
import MemoryFS = require("memory-fs");


function initConfig(args: Args) {
    const userConfig = new ConfigMapper().getUserConfig(args["--conf"])
    console.log(userConfig);
    userConfig.disablePlugins = args["--disable-plugins"] || !!userConfig.disablePlugins;
    userConfig.pro = args["--export"] || args["--pro"] || !!userConfig.pro;
    userConfig.verbose = args["--verbose"] || !!userConfig.verbose;
    userConfig.logMode = args["--plain"] ? "plain" : args["--silent"] ? "silent" : userConfig.logMode;
    userConfig.paths = userConfig.paths || {}
    userConfig.paths = {
        fly: args["--fly"] || userConfig.paths.fly,
        out: args["--out"] || userConfig.paths.out,
        root: args["--root"] || userConfig.paths.root,
        cache: args["--cache"] || userConfig.paths.cache,
        dist: args["--dist"] || userConfig.paths.dist,
        map: args["--map"] || userConfig.paths.map,
        pages: args["--pages"] || userConfig.paths.pages,
        template: args["--template"] || userConfig.paths.template,
        src: args["--src"] || userConfig.paths.src,
        static: args["--static"] || userConfig.paths.static,
        plugins: args["--plugins"] || userConfig.paths.plugins,
        lib: args["--lib"] || userConfig.paths.lib
    }
    return userConfig;
}

function initWebpackConfig(args: Args) {
    const webpackConfig = args["--webpack-conf"] ? require(resolve(process.cwd(), args["--webpack-conf"])) : {};
    if (!args["--export"])
        webpackConfig.watch = webpackConfig.watch || true;
    return webpackConfig;
}

(async function () {
    const args = getArgs();
    args["--export"] = args["--export-fly"] ? true : args["--export"]
    const config = initConfig(args);
    if (args["--disk"])
        config.paths.dist = config.paths.cache;
    const webpackConfig = initWebpackConfig(args);
    console.log(webpackConfig);
    const app = args["--export"] ?
        new FireJS({config, webpackConfig}) :
        new FireJS({
            config,
            webpackConfig,
            outputFileSystem: args["--disk"] ? undefined : new MemoryFS()
        })
    const $ = app.getContext();
    try {
        await app.init();
        if (args["--export"]) {
            const startTime = new Date().getTime();
            const promises = []
            $.pageMap.forEach(page => {
                promises.push(app.buildPage(page));
            })
            await Promise.all(promises);
            $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");

            if (args["--export-fly"]) {
                $.cli.log("Exporting for on the fly builds");
                const map: FIREJS_MAP = {
                    staticConfig: $.renderer.param,
                    pageMap: {},
                }
                for (const page of $.pageMap.values()) {
                    map.pageMap[page.toString()] = page.chunks;
                    page.chunks.forEach(chunk => {
                        if (chunk.endsWith(".js")) {//only js files are required
                            const chunkPath = join($.config.paths.lib, chunk);
                            $.outputFileSystem.exists(chunkPath, exists => {
                                if (exists) {//only copy if it exists because it might be already copied before for page having same chunk
                                    $.outputFileSystem.rename(chunkPath, join($.config.paths.fly, chunk), err => {
                                        if (err)
                                            throw new Error(`Error while moving ${chunkPath} to ${$.config.paths.fly}`);
                                    });
                                }
                            });
                        }
                    })
                }
                $.outputFileSystem.writeFileSync(join($.config.paths.fly, "firejs.map.json"),
                    JSON.stringify(map));
            }
            process.on('exit', () => {
                $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
                if ($.config.paths.static)
                    $.cli.warn("Don't forget to copy the static folder to dist");
            })
        } else {
            const server = new Server(app);
            await server.init();
        }
    } catch (err) {
        $.cli.error(err)
    }
})()