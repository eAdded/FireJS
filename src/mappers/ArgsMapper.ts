import args = require("args");

export interface Args {
    "webpack-conf"?: string,
    "export"?: boolean,           //Export
    "export-fly"?: boolean,       //Export path for on the fly builds
    "disk"?: boolean,             //Write to disk instead of memory
    "conf"?: string,              //Path to Config file
    "verbose"?: boolean,          //Log Webpack Stat
    "plain"?: boolean,            //Log without styling i.e colors and symbols
    "silent"?: boolean,           //Log errors only
    "disable-plugins"?: boolean,  //Disable plugins
    //path
    "root"?: string,      //project root, default : process.cwd()
    "src"?: string,       //src dir, default : root/src
    "pages"?: string,     //pages dir, default : root/src/pages
    "out"?: string,       //production dist, default : root/out
    "dist"?: string,      //production dist, default : root/out/dist
    "cache"?: string,     //cache dir, default : root/out/.cache
    "fly"?: string,       //cache dir, default : root/out/fly
    "template"?: string,  //template file, default : inbuilt template file
    "lib"?: string,       //dir where chunks are exported, default : root/out/dist/lib
    "map"?: string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
    "static"?: string,    //dir where page static elements are stored eg. images, default : root/src/static
    "plugins"?: string,   //plugins dir, default : root/src/plugins
}

export function getArgs(): Args {
    args
        .option("webpack-conf", "path to webpack config")
        .option(["e", "export"], "export project")
        .option(["d", "disk"], "store chunks in disk instead of memory in dev server")
        .option(["p", "pro"], "production mode")
        .option(["c", "conf"], "path to firejs config file")
        .option(["v", "verbose"], "print webpack states")
        .option(["s", "silent"], "only print errors")
        .option("disable-plugins", "disable plugins")
        //paths
        .command("root", "project root, default : process.cwd()")
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