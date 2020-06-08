"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SmartArg_1 = require("smartarg/SmartArg");
function getArgs() {
    return new SmartArg_1.default()
        .name("Fire JS")
        .description("A zero config, highly customizable, progressive react static site generator with blazingly fast SSR and on the fly builds.")
        // @ts-ignore
        .version(global.__FIREJS_VERSION__)
        //mode
        .option(["-p", "--pro"], Boolean, "use production chunks. NODE_ENV : production")
        .option(["-e", "--export"], Boolean, "export project for distribution")
        .option(["-d", "--disk"], Boolean, "store chunks to disk instead of memory while in dev server")
        .option(["-s", "--ssr"], Boolean, "Server Side Render. Available only with -d and -e")
        .option(["-E", "--export-fly"], Boolean, "export project for distribution and for fly build")
        //conf
        .option(["-c", "--conf"], String, "path to FireJS config file")
        .option(["--webpack-conf"], String, "path to webpack config")
        //logging
        .option(["--verbose"], Boolean, "print webpack stats on error")
        .option(["-l", "--log-mode"], String, "Log Mode. silent (log errors only) | plain (Log without styling i.e colors and symbols)")
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
        .example("firejs -esp", "export server side rendered production build")
        .example("firejs -dsp", "write to disk when using dev server with server side rendered production build")
        .smartParse();
}
exports.getArgs = getArgs;
