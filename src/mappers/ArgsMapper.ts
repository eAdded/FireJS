import Arg from "../utils/Arg"

export interface Args {
    "--webpack-conf"?: string,
    "--version"?: boolean,             //Print Help
    "--help"?: boolean,             //Print Help
    "--pro"?: boolean,              //Production mode
    "--export"?: boolean,           //Export
    "--export-fly"?: boolean,       //Export path for on the fly builds
    "--disk"?: boolean,             //Write to disk instead of memory
    "--conf"?: string,              //Path to Config file
    "--verbose"?: boolean,          //Log Webpack Stat
    "--plain"?: boolean,            //Log without styling i.e colors and symbols
    "--silent"?: boolean,           //Log errors only
    "--disable-plugins"?: boolean,  //Disable plugins
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
    return (new Arg<Args>()
        .name("Fire JS")
        .description("Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app")
        .version("1.0.0")
        .option(["--webpack-conf"], String, "path to webpack config")
        .option(["-e", "--export"], Boolean, "export project")
        .option(["-d", "--disk"], Boolean, "store chunks in disk instead of memory in dev server")
        .option(["-p", "--pro"], Boolean, "production mode")
        .option(["-c", "--conf"], Boolean, "path to FireJS config file")
        .option(["-V", "--verbose"], Boolean, "print webpack stats")
        .option(["-s", "--silent"], Boolean, "only print errors")
        .option(["-h", "--help"], Boolean, "only print errors")
        .option(["-v", "--version"], Boolean, "only print errors")
        .option(["--disable-plugins"], Boolean, "disable plugins")
        //paths
        .option(["--root"], String, "project root, default : process.cwd()")
        .option(["--src"], String, "src dir, default : root/src")
        .option(["--pages"], String, "pages dir, default : root/src/pages")
        .option(["--out"], String, "production dist, default : root/out")
        .option(["--dist"], String, "production dist, default : root/out/dist")
        .option(["--cache"], String, "cache dir, default : root/out/.cache")
        .option(["--fly"], String, "cache dir, default : root/out/fly")
        .option(["--template"], String, "template file, default : inbuilt template file")
        .option(["--lib"], String, "dir where chunks are exported, default : root/out/dist/lib")
        .option(["--map"], String, "dir where chunk map and page data is exported, default : root/out/dist/lib/map")
        .option(["--static"], String, "dir where page static elements are stored eg. images, default : root/src/static")
        .option(["--plugins"], String, "plugins dir, default : root/src/plugins")).smartParse();
}