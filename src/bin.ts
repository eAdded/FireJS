#!/usr/bin/env node
import FireJS, {FIREJS_MAP} from "./FireJS"
import Server from "./server"
import {join} from "path"
import {Args, getArgs} from "./mappers/ArgsMapper";
import MemoryFS = require("memory-fs");

import ConfigMapper from "./mappers/ConfigMapper";

function printHelp() {
    console.log("\n\n    \x1b[1m Fire JS \x1b[0m - Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app.");
    console.log("\n    \x1b[1m Flags \x1b[0m\n" +
        "\n\t\x1b[34m--pro, -p\x1b[0m\n\t    Production Mode\n" +
        "\n\t\x1b[34m--conf, -c\x1b[0m\n\t    Path to Config file\n" +
        "\n\t\x1b[34m--verbose, -v\x1b[0m\n\t    Log Webpack Stat\n" +
        "\n\t\x1b[34m--plain\x1b[0m\n\t    Log without styling i.e colors and symbols\n" +
        "\n\t\x1b[34m--silent, s\x1b[0m\n\t    Log errors only\n" +
        "\n\t\x1b[34m--disable-plugins\x1b[0m\n\t    Disable plugins\n" +
        "\n\t\x1b[34m--help, -h\x1b[0m\n\t    Help")
    console.log("\n     \x1b[1mVersion :\x1b[0m 0.10.1");
    console.log("\n     \x1b[1mVisit https://github.com/eAdded/FireJS for documentation\x1b[0m\n\n")
    process.exit(0);
}

function initConfig(args: Args) {
    const userConfig = new ConfigMapper().getUserConfig(args["--conf"])
    userConfig.disablePlugins = args["--disable-plugins"] || !!userConfig.disablePlugins;
    userConfig.pro = args["--export"] || args["--pro"] || !!userConfig.pro;
    userConfig.verbose = args["--verbose"] || !!userConfig.verbose;
    userConfig.logMode = args["--plain"] ? "plain" : args["--silent"] ? "silent" : userConfig.logMode;
    return userConfig;
}

(async function () {
    const args = getArgs();
    if (args["--help"])
        printHelp();
    const config = initConfig(args);
    const app = args["--export"] ?
        new FireJS({config}) :
        new FireJS({
            config,
            webpackConfig : {
                watch : true
            },
            outputFileSystem: args["--disk"] ? undefined : new MemoryFS()
        })
    const $ = app.getContext();
    try {
        if (args["--export"]) {
            const startTime = new Date().getTime();
            await app.init();
            const promises = []
            $.pageMap.forEach(page => {
                promises.push(app.buildPage(page));
            })
            await Promise.all(promises);
            $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");

            $.cli.log("Generating babel chunk map");
            const map: FIREJS_MAP = {
                staticConfig: $.renderer.param,
                pageMap: {},
            }
            for (const page of $.pageMap.values())
                map.pageMap[page.toString()] = page.chunks
            $.outputFileSystem.writeFileSync(join($.config.paths.dist, "firejs.map.json"),
                JSON.stringify(map));
            $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
            if ($.config.paths.static)
                $.cli.warn("Don't forget to copy the static folder to dist");
        } else {
            const server = new Server(app);
            await server.init();
        }
    } catch (err) {
        $.cli.error(err)
    }
})()