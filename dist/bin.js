#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FireJS_1 = require("./FireJS");
const server_1 = require("./server");
const path_1 = require("path");
const ArgsMapper_1 = require("./mappers/ArgsMapper");
const ConfigMapper_1 = require("./mappers/ConfigMapper");
const MemoryFS = require("memory-fs");
let customConfig = false;
function initConfig(args) {
    let userConfig = new ConfigMapper_1.default().getUserConfig(args["--conf"]);
    customConfig = !!userConfig;
    userConfig = userConfig || {};
    userConfig.disablePlugins = args["--disable-plugins"] || !!userConfig.disablePlugins;
    userConfig.pro = args["--export"] || args["--pro"] || !!userConfig.pro;
    userConfig.verbose = args["--verbose"] || !!userConfig.verbose;
    userConfig.logMode = args["--plain"] ? "plain" : args["--silent"] ? "silent" : userConfig.logMode;
    userConfig.paths = userConfig.paths || {};
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
    };
    return userConfig;
}
function initWebpackConfig(args, { paths: { webpackConfig } }) {
    const webpackConf = webpackConfig ? require(path_1.isAbsolute(webpackConfig) ? webpackConfig : path_1.resolve(process.cwd(), webpackConfig)) : {};
    if (!args["--export"])
        webpackConf.watch = webpackConf.watch || true;
    return webpackConf;
}
function init() {
    const args = ArgsMapper_1.getArgs();
    args["--export"] = args["--export-fly"] ? true : args["--export"];
    const config = initConfig(args);
    if (args["--disk"]) {
        if (args["--export"])
            throw new Error("flag --disk is redundant when exporting");
        config.paths.dist = config.paths.cache || path_1.join(config.paths.out || "out", ".cache");
    }
    const webpackConfig = initWebpackConfig(args, config);
    config.paths.webpackConfig = undefined;
    return {
        app: args["--export"] ?
            new FireJS_1.default({ config, webpackConfig }) :
            new FireJS_1.default({
                config,
                webpackConfig,
                outputFileSystem: args["--disk"] ? undefined : new MemoryFS()
            }),
        args
    };
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { app, args } = init();
        const $ = app.getContext();
        $.cli.log(`mode : ${$.config.pro ? "production" : "development"}`);
        if (customConfig)
            $.cli.log("Using config from user");
        else
            $.cli.log("Using default config");
        try {
            yield app.init();
            if (args["--export"]) {
                $.cli.ok("Exporting");
                const startTime = new Date().getTime();
                const promises = [];
                $.pageMap.forEach(page => {
                    promises.push(app.buildPage(page));
                });
                yield Promise.all(promises);
                $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
                if (args["--export-fly"]) {
                    $.cli.ok("Exporting for fly builds");
                    const map = {
                        staticConfig: $.renderer.param,
                        pageMap: {},
                    };
                    for (const page of $.pageMap.values()) {
                        map.pageMap[page.toString()] = page.chunks;
                        page.chunks.forEach(chunk => {
                            if (chunk.endsWith(".js")) { //only js files are required
                                const chunkPath = path_1.join($.config.paths.lib, chunk);
                                $.outputFileSystem.exists(chunkPath, exists => {
                                    if (exists) { //only copy if it exists because it might be already copied before for page having same chunk
                                        $.outputFileSystem.rename(chunkPath, path_1.join($.config.paths.fly, chunk), err => {
                                            if (err)
                                                throw new Error(`Error while moving ${chunkPath} to ${$.config.paths.fly}`);
                                        });
                                    }
                                });
                            }
                        });
                    }
                    $.outputFileSystem.writeFileSync(path_1.join($.config.paths.fly, "firejs.map.json"), JSON.stringify(map));
                }
                process.on('exit', () => {
                    $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
                    if ($.config.paths.static)
                        $.cli.warn("Don't forget to copy the static folder to dist");
                });
            }
            else {
                const server = new server_1.default(app);
                yield server.init();
            }
        }
        catch (err) {
            $.cli.error(err);
        }
    });
})().catch(err => console.error(err));
