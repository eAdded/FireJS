import arg = require("arg");

export interface Args {
    "--webpack-conf"?: string,
    "--export"?: boolean,           //Export
    "--export-fly"?: boolean,       //Export path for on the fly builds
    "--disk"?: boolean,             //Write to disk instead of memory
    "--conf"?: string,              //Path to Config file
    "--verbose"?: boolean,          //Log Webpack Stat
    "--plain"?: boolean,            //Log without styling i.e colors and symbols
    "--silent"?: boolean,           //Log errors only
    "--disable-plugins"?: boolean,  //Disable plugins
    "--help"?: boolean,             //Help
    //path
    "--root"?: string,      //project root, default : process.cwd()
    "--src"?: string,       //src dir, default : root/src
    "--pages"?: string,     //pages dir, default : root/src/pages
    "--out"?: string,       //production dist, default : root/out
    "--dist"?: string,      //production dist, default : root/out/dist
    "--cache"?: string,     //cache dir, default : root/out/.cache
    "--fly"?: string,       //cache dir, default : root/out/fly
    "--template"?: string,  //template file, default : inbuilt template file
    "--lib"?: string,       //dir where chunks are exported, default : root/out/dist/lib
    "--map"?: string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
    "--static"?: string,    //dir where page static elements are stored eg. images, default : root/src/static
    "--plugins"?: string,   //plugins dir, default : root/src/plugins
}

export function getArgs(): Args {
    return arg({
        //Types
        "--webpack-conf": String,
        "--export": Boolean,
        "--export-fly": Boolean,
        "--disk": Boolean,
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--plain": Boolean,
        "--silent": Boolean,
        "--disable-plugins": Boolean,
        "--help": Boolean,
        //Aliases
        "-w": "--webpack-conf",
        "-e": "--export",
        "-d": "--disk",
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "-s": "--silent",
        "-h": "--help",
        //paths
        "--root": String,      //project root, default : process.cwd()
        "--src": String,       //src dir, default : root/src
        "--pages": String,     //pages dir, default : root/src/pages
        "--out": String,       //production dist, default : root/out
        "--dist": String,      //production dist, default : root/out/dist
        "--cache": String,     //cache dir, default : root/out/.cache
        "--fly": String,       //cache dir, default : root/out/fly
        "--template": String,  //template file, default : inbuilt template file
        "--lib": String,       //dir where chunks are exported, default : root/out/dist/lib
        "--map": String,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
        "--static": String,    //dir where page static elements are stored eg. images, default : root/src/static
        "--plugins": String   //plugins dir, default : root/src/plugins
    })
}