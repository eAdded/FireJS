"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args = require("args");
function getArgs() {
    args.option("webpack-conf")
        .option("export")
        .option("disk")
        .option("pro")
        .option("conf")
        .option("verbose")
        .option("silent")
        .option("disable-plugins")
        //paths
        .option(["", "root"], "project root, default : process.cwd()")
        .option("src", "src dir, default : root/src")
        .option("pages", "pages dir, default : root/src/pages")
        .option("out", "production dist, default : root/out")
        .option("dist", "production dist, default : root/out/dist")
        .option("cache", "cache dir, default : root/out/.cache")
        .option("fly", "cache dir, default : root/out/fly")
        .option("template", "template file, default : inbuilt template file")
        .option("lib", "dir where chunks are exported, default : root/out/dist/lib")
        .option("map", "dir where chunk map and page data is exported, default : root/out/dist/lib/map")
        .option("static", "dir where page static elements are stored eg. images, default : root/src/static")
        .option("plugins", "plugins dir, default : root/src/plugins");
    return args.parse(process.argv);
}
exports.getArgs = getArgs;
