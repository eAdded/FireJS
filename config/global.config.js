const path = require("path");
const fs = require("fs");
const name = "react-static-gen";
/**
 * @type {{production:Boolean,conf:String,verbose:Boolean,no_color:Boolean,no_output:Boolean}}
 */
//load args first to prevent dependency problem between cli and config
module.exports.args = require("arg")({
    //Types
    "--production": Boolean,
    "--conf": String,
    "--verbose": Boolean,
    "--no_color": Boolean,
    "--no_output": Boolean,
    //Aliases
    "-p": "--production",
    "-c": "--conf",
    "-v": "--verbose",
    "--nc": "--no_color",
    "--no": "--no_output"
});

const cli = require("../utils/cli-color");

function getUserConfig() {
    const args = module.exports.args;
    const wasGiven = args["--conf"];//to store if user gave this arg so that log can be changed
    if (args["--conf"]) {//tweak conf path
        if (!path.isAbsolute(args["--conf"]))
            args["--conf"] = path.resolve(process.cwd(), args["--conf"]);//create absolute path
    } else
        args["--conf"] = path.resolve(process.cwd(), `${name}.config.js`);

    return fs.existsSync(args["--conf"]) ? (() => {///check if config file exists
        cli.log(`Loading config from ${args["--conf"]}`);
        return require(args["--conf"])
    })() : (() => {//if config does not exists just return args
        if (wasGiven)
            cli.warn(`Config not found at ${args["--conf"]}. Loading defaults`);
        return {};
    })()
}

function makeAbsolute(root, pathTo) {
    return path.isAbsolute(pathTo) ? pathTo : path.resolve(root, pathTo);
}

function throwIfNotFound(name, pathTo) {
    if (!fs.existsSync(pathTo))
        cli.throwError(new Error(`${name} not found`))
}

function undefinedIfNotFound(config, property, pathRoot, name, msg) {
    if (config[property]) {
        throwIfNotFound(msg, config[property])
        config[property] = makeAbsolute(pathRoot,config[property]);
    }else if (!fs.existsSync(config[property] = path.join(pathRoot,name)))
        config[property] = undefined;
}

function getPlugins(config) {

}

module.exports.config = (() => {
    cli.log("Loading configs");
    const config = getUserConfig();
    config.mode = module.exports.args["--production"] ? "production" : config.mode || "development";
    cli.log("mode : " + config.mode)
    config.name = name;
    throwIfNotFound("root dir", config.root = config.root ? makeAbsolute(process.cwd(), config.root) : process.cwd());
    throwIfNotFound("src dir", config.src = config.src ? makeAbsolute(config.root, config.src) : path.join(config.root, "src"));
    throwIfNotFound("pages dir", config.pages = config.pages ? makeAbsolute(config.root, config.pages) : path.join(config.src, "pages"));
    config.dist = config.dist ? makeAbsolute(config.root, config.dist) : path.join(config.root, "dist");
    undefinedIfNotFound(config, "pluginsDir", config.root, "plugins", "plugins dir");
    undefinedIfNotFound(config, "webpack", config.root, "webpack.config.js", "webpack config");
    getPlugins(config);


    return config;
})()