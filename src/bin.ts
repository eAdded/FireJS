#!/usr/bin/env node
import FireJS, {FIREJS_MAP} from "./FireJS"
import Server from "./server"
import {join, resolve} from "path"
import {Args, getArgs} from "./mappers/ArgsMapper";

import ConfigMapper from "./mappers/ConfigMapper";
import MemoryFS = require("memory-fs");

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

function initWebpackConfig(args: Args) {
    const webpackConfig = args["--webpack-conf"] ? require(resolve(process.cwd(), args["--webpack-conf"])) : {};
    if (!args["--export"])
        webpackConfig.watch = webpackConfig.watch || true;
    return webpackConfig;
}

(async function () {
    const args = getArgs();
    args["--export"] = !!args["--export-fly"];
    if (args["--help"])
        printHelp();
    const app = args["--export"] ?
        new FireJS({config: initConfig(args), webpackConfig: initWebpackConfig(args)}) :
        new FireJS({
            config: initConfig(args),
            webpackConfig: initWebpackConfig(args),
            outputFileSystem: args["--disk"] ? undefined : new MemoryFS()
        })
    const $ = app.getContext();
    try {
        await app.init();
        if (args["--export"]) {
            if (args["--export-fly"])
                if (!$.outputFileSystem.existsSync(args["--export-fly"] = join($.config.paths.root, args["--export-fly"])))
                    $.outputFileSystem.mkdirSync(args["--export-fly"]);

            const startTime = new Date().getTime();
            const promises = []
            $.pageMap.forEach(page => {
                promises.push(app.buildPage(page));
            })
            await Promise.all(promises);
            $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
            if (args["--export-fly"]) {
                $.outputFileSystem.mkdirp(args["--export-fly"], (err) => {
                    if (err)
                        throw new Error("Error making dir " + args["--export-fly"]);
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
                                        $.outputFileSystem.rename(chunkPath, join(args["--export-fly"], chunk), err => {
                                            if (err)
                                                throw new Error(`Error while moving ${chunkPath} to ${args["--export-fly"]}`);
                                        });
                                    }
                                });
                            }
                        })
                    }
                    $.outputFileSystem.writeFileSync(join(args["--export-fly"], "firejs.map.json"),
                        JSON.stringify(map));
                })
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