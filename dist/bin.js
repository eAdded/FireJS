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
const MemoryFS = require("memory-fs");
const ConfigMapper_1 = require("./mappers/ConfigMapper");
function printHelp() {
    console.log("\n\n    \x1b[1m Fire JS \x1b[0m - Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.");
    console.log("\n    \x1b[1m Flags \x1b[0m\n" +
        "\n\t\x1b[34m--pro, -p\x1b[0m\n\t    Production Mode\n" +
        "\n\t\x1b[34m--conf, -c\x1b[0m\n\t    Path to Config file\n" +
        "\n\t\x1b[34m--verbose, -v\x1b[0m\n\t    Log Webpack Stat\n" +
        "\n\t\x1b[34m--plain\x1b[0m\n\t    Log without styling i.e colors and symbols\n" +
        "\n\t\x1b[34m--silent, s\x1b[0m\n\t    Log errors only\n" +
        "\n\t\x1b[34m--disable-plugins\x1b[0m\n\t    Disable plugins\n" +
        "\n\t\x1b[34m--help, -h\x1b[0m\n\t    Help");
    console.log("\n     \x1b[1mVersion :\x1b[0m 0.10.1");
    console.log("\n     \x1b[1mVisit https://github.com/eAdded/FireJS for documentation\x1b[0m\n\n");
    process.exit(0);
}
function initConfig(args) {
    const userConfig = new ConfigMapper_1.default().getUserConfig(args["--conf"]);
    userConfig.disablePlugins = args["--disable-plugins"] || !!userConfig.disablePlugins;
    userConfig.pro = args["--export"] || args["--pro"] || !!userConfig.pro;
    userConfig.verbose = args["--verbose"] || !!userConfig.verbose;
    userConfig.logMode = args["--plain"] ? "plain" : args["--silent"] ? "silent" : userConfig.logMode;
    return userConfig;
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const args = ArgsMapper_1.getArgs();
        if (args["--help"])
            printHelp();
        const config = initConfig(args);
        const app = args["--export"] ?
            new FireJS_1.default({ config }) :
            new FireJS_1.default({
                config,
                webpackConfig: {
                    watch: true
                },
                outputFileSystem: args["--disk"] ? undefined : new MemoryFS()
            });
        const $ = app.getContext();
        try {
            if (args["--export"]) {
                const startTime = new Date().getTime();
                yield app.init();
                const promises = [];
                $.pageMap.forEach(page => {
                    promises.push(app.buildPage(page));
                });
                yield Promise.all(promises);
                $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
                $.cli.log("Generating babel chunk map");
                const map = {
                    staticConfig: $.renderer.param,
                    pageMap: {},
                };
                for (const page of $.pageMap.values())
                    map.pageMap[page.toString()] = page.chunks;
                $.outputFileSystem.writeFileSync(path_1.join($.config.paths.dist, "firejs.map.json"), JSON.stringify(map));
                $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
                if ($.config.paths.static)
                    $.cli.warn("Don't forget to copy the static folder to dist");
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
})();
