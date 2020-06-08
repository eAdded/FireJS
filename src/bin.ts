#!/usr/bin/env node
import FireJS, {FIREJS_MAP, WebpackConfig} from "./FireJS"
import Server from "./server"
import {isAbsolute, join, resolve} from "path"
import {Args, getArgs} from "./mappers/ArgsMapper";

import ConfigMapper, {Config} from "./mappers/ConfigMapper";
import MemoryFS = require("memory-fs");

function initConfig(args: Args): [boolean, Config] {
    let userConfig = new ConfigMapper().getUserConfig(args["--conf"])
    const customConfig = !!userConfig;
    userConfig = userConfig || {};
    userConfig.disablePlugins = args["--disable-plugins"] || userConfig.disablePlugins;
    userConfig.pro = args["--pro"] || userConfig.pro;
    userConfig.verbose = args["--verbose"] || userConfig.verbose;
    userConfig.logMode = args["--log-mode"] || userConfig.logMode;
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
        lib: args["--lib"] || userConfig.paths.lib,
        webpackConfig: args["--webpack-conf"] || userConfig.paths.webpackConfig
    }
    userConfig.ssr = args["--ssr"] || userConfig.ssr;
    return [customConfig, userConfig];
}

function initWebpackConfig(args: Args, {paths: {webpackConfig}}: Config): WebpackConfig {
    const webpackConf: WebpackConfig = webpackConfig ? require(isAbsolute(webpackConfig) ? webpackConfig : resolve(process.cwd(), webpackConfig)) : {};
    if (!args["--export"])
        webpackConf.watch = webpackConf.watch || true;
    return webpackConf;
}

function init(): { app: FireJS, args: Args, customConfig: boolean } {
    const args = getArgs();
    //export if export-fly
    args["--export"] = args["--export-fly"] ? true : args["--export"]
    //check if log mode is valid
    if (args["--log-mode"])
        if (args["--log-mode"] !== "silent" && args["--log-mode"] !== "plain")
            throw new Error(`unknown log mode ${args["--log-mode"]}. Expected [ silent | plain ]`)
    //init config acc to args
    const [customConfig, config] = initConfig(args);
    //config disk
    if (args["--disk"]) {
        if (args["--export"])
            throw new Error("flag --disk is redundant when exporting")
        config.paths.dist = join(config.paths.cache||"out/.cache", "disk");
    }
    //get webpack config
    const webpackConfig = initWebpackConfig(args, config);
    //undefined cause it is not valid in the main app
    config.paths.webpackConfig = undefined;
    //return acc to flags
    return {
        app: args["--export"] ?
            new FireJS({config, webpackConfig}) :
            new FireJS({
                config,
                webpackConfig,
                outputFileSystem: args["--disk"] ? undefined : new MemoryFS()
            }),
        args,
        customConfig
    }
}

(async function () {
    const {app, args, customConfig} = init();
    const $ = app.getContext();
    if (customConfig)
        $.cli.log("Using config from user")
    else
        $.cli.log("Using default config")
    try {
        await app.init();
        if (args["--export"]) {
            $.cli.ok("Exporting");
            const startTime = new Date().getTime();
            const promises = []
            $.pageMap.forEach(page => {
                promises.push(app.buildPage(page));
            })
            await Promise.all(promises);
            $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");

            if (args["--export-fly"]) {
                $.cli.ok("Exporting for fly builds");
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
})().catch(err => console.error(err));
