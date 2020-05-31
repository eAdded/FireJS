"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SmartArg_1 = require("smartarg/SmartArg");
function getArgs() {
    return new SmartArg_1.default()
        .name("Fire JS")
        .description("Highly customizable no config react static site generator built on the principles of gatsby, nextjs and create-react-app")
        // @ts-ignore
        .version(global.__FIREJS_VERSION__)
        //mode
        .option(["-e", "--export"], Boolean, "export project for distribution")
        .option(["--export-fly"], Boolean, "export project for distribution and for fly build")
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
        .smartParse();
}
exports.getArgs = getArgs;
