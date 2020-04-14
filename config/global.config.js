const args = require("arg")({ //load args first to prevent dependency problem between cli and config
    //Types
    "--conf": String,
    "--verbose": Boolean,
    "--no-color": Boolean,
    //Aliases
    "-c": "--conf",
    "-v": "--verbose",
    "--nc": "--no-color"
})
module.exports = args;
const path = require("path");
const fs = require("fs");
const cli = require("../utils/cli-color");

function getUserConfig(defaultFile) {
    return ((args["--conf"] ? //undefined if !exists else empty object
        fs.existsSync(args["--conf"]) ?
            {}
            : (() => {
                cli.warn(`Config not found at ${args["--conf"]}\n\tLoading from default location`);
                return undefined
            })()
        : undefined) ? {...require(args["--conf"]), ...args}
        : fs.existsSync(defaultFile) ? (() => {
            cli.log("User configs found. Loading");
            return {...require(defaultFile), ...args}
        })() : (() => {
            cli.warn("No user config found. Loading defaults");
            return args;
        })());
}

module.exports = (() => {
    cli.log("Loading Configs");
    const userConf = getUserConfig();
    cli.ok("Configs loaded");
    userConf.root = userConf.root ? userConf.root : process.cwd();
    userConf.src = userConf.src ? userConf.src : path.join(userConf.root, "src");
    return {
        plugins: [],
        ...userConf,
        webpack: userConf.webpack ? userConf.webpack : (() => {
            const defaultPath = path.join(userConf.root, "webpack.config.js");
            if (fs.existsSync(defaultPath))
                return defaultPath;
            else
                return undefined;
        })(),
        dist: userConf.dist ? userConf.dist : path.join(userConf.root, "dist"),
        pages: userConf.pages ? userConf.pages : path.join(userConf.src, "pages"),
        name: "react-static-gen"
    };
})()