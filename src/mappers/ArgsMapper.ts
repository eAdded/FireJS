import SmartArg from "smartarg/SmartArg";

export interface Args {
    //mode
    "--pro": boolean,              //Production mode
    "--export": boolean,           //Export
    "--export-fly": boolean,       //Export path for on the fly builds
    "--disk": boolean,             //Write to disk instead of memory
    //conf
    "--webpack-conf": string,
    "--conf": string,              //Path to Config file
    //log
    "--verbose": boolean,          //Log Webpack Stat
    "--plain": boolean,            //Log without styling i.e colors and symbols
    "--silent": boolean,           //Log errors only
    "--disable-plugins": boolean,  //Disable plugins
    //path
    "--root": string,      //project root, default : process.cwd()
    "--src": string,       //src dir, default : root/src
    "--pages": string,     //pages dir, default : root/src/pages
    "--out": string,       //production dist, default : root/out
    "--dist": string,      //production dist, default : root/out/dist
    "--cache": string,     //cache dir, default : root/out/.cache
    "--fly": string,       //cache dir, default : root/out/fly
    "--template": string,  //template file, default : inbuilt template file
    "--lib": string,       //dir where chunks are exported, default : root/out/dist/lib
    "--map": string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
    "--static": string,    //dir where page static elements are stored eg. images, default : root/src/static
    "--plugins": string,   //plugins dir, default : root/src/plugins
}

export function getArgs(): Args {
    return <Args>new SmartArg<Args>()
        .name("Fire JS")
        .description("Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app")
        .version("1.0.0")
        //mode
        .option(["-e", "--export"], Boolean, "export project")
        .option(["--export-fly"], Boolean, "export project for fly build")
        .option(["-d", "--disk"], Boolean, "store chunks to disk instead of memory while in dev server")
        .option(["-p", "--pro"], Boolean, "production mode")
        //conf
        .option(["-c", "--conf"], String, "path to FireJS config file")
        .option(["--webpack-conf"], String, "path to webpack config")
        //logging
        .option(["-V", "--verbose"], Boolean, "print webpack stats")
        .option(["-s", "--silent"], Boolean, "only print errors")
        .option(["--plain"], Boolean, "print without styling i.e colors and symbols")
        //plugins
        .option(["--disable-plugins"], Boolean, "disable plugins")
        //paths
        .option(["--root"], String, "path to project root, default : process.cwd()")
        .option(["--src"], String, "path to src dir, default : root/src")
        .option(["--pages"], String, "path to pages dir, default : root/src/pages")
        .option(["--out"], String, "path to output dir, default : root/out")
        .option(["--dist"], String, "path to dir where build is exported, default : root/out/dist")
        .option(["--cache"], String, "path to cache dir, default : root/out/.cache")
        .option(["--fly"], String, "path to dir where fly build is exported, default : root/out/fly")
        .option(["--template"], String, "path to template file, default : inbuilt template file")
        .option(["--lib"], String, "path to dir where chunks are exported, default : root/out/dist/lib")
        .option(["--map"], String, "path to dir where chunk map and page data is exported, default : root/out/dist/lib/map")
        .option(["--static"], String, "path to dir where static assets are stored eg. images, default : root/src/static")
        .option(["--plugins"], String, "path to plugins dir, default : root/src/plugins")
        .smartParse()
}