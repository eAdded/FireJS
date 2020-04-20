const path = require("path");
const fs = require("fs");
const name = "react-static-gen";
/**
 * @type {*|arg.Result<{"--nc": string, "--production": BooleanConstructor, "-p": string, "--no": string, "--conf": StringConstructor, "-c": string, "--no_output": BooleanConstructor, "-v": string, "--verbose": BooleanConstructor, "--no_color": BooleanConstructor}>}
 */
//load args first to prevent dependency problem between cli and config
module.exports.getArgs = () => {
    return require("arg")({
        //Types
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--no_color": Boolean,
        "--no_output": Boolean,
        //Aliases
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "--nc": "--no_color",
        "--no": "--no_output"
    })
};

const cli = require("../utils/cli-color");

function getUserConfig() {
    const {args} = require("../store/global.data");
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
        config[property] = makeAbsolute(pathRoot, config[property]);
    } else if (!fs.existsSync(config[property] = path.join(pathRoot, name)))
        config[property] = undefined;
}

function getPlugins(config) {
    config.plugins = config.plugins || [];
    config.plugins.forEach((plugin, index) => {
        if (!pluginExists(plugin, [config.paths.root])) {
            config.plugins.splice(index, 1);
            cli.warn(`Plugin ${plugin} is not a valid plugin. Removing...`);
        }
    })
    fs.readdirSync(config.paths.plugins).forEach(plugin => {
        const pPath = path.join(config.paths.plugins, plugin);
        if (pluginExists(pPath))
            config.plugins.push(pPath);
        else
            cli.warn(`Plugin ${plugin} is not a valid plugin. Removing...`);
    });

}

function pluginExists(plugin, paths) {
    try {
        require.resolve(plugin, {paths});
        return true;
    } catch (ex) {
        return false;
    }
}

function makeDirIfNotFound(path) {
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
}

/**
 * @type {{}}
 */
module.exports.getConfig = (userConfig) => {
    cli.log("Loading configs");
    const config = userConfig || getUserConfig();
    config.pro = args["--pro"] ? true : config.pro || false;
    args["--pro"] = undefined;
    cli.log("mode : " + config.pro ? "production" : "development")
    config.name = name;
    config.paths = {};
    throwIfNotFound("root dir", config.paths.root = config.paths.root ? makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
    throwIfNotFound("src dir", config.paths.src = config.paths.src ? makeAbsolute(config.paths.root, config.paths.src) : path.join(config.paths.root, "src"));
    throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? makeAbsolute(config.paths.root, config.paths.pages) : path.join(config.paths.src, "pages"));
    //out
    makeDirIfNotFound(config.paths.out = config.paths.out ? makeAbsolute(config.paths.root, config.paths.out) : path.join(config.paths.root, "out"));
    makeDirIfNotFound(config.paths.dist = config.paths.dist ? makeAbsolute(config.paths.out, config.paths.dist) : path.join(config.paths.out, "dist"));
    makeDirIfNotFound(config.paths.pageData = config.paths.pageData ? makeAbsolute(config.paths.out, config.paths.pageData) : path.join(config.paths.dist, "pageData"));
    makeDirIfNotFound(config.paths.cache = config.paths.cache ? makeAbsolute(config.paths.out, config.paths.cache) : path.join(config.paths.out, ".cache"));
    //configs
    undefinedIfNotFound(config.paths, "plugins", config.paths.src, "plugins", "plugins dir");
    undefinedIfNotFound(config.paths, "webpack", config.paths.root, "webpack.config.js", "webpack config");
    getPlugins(config);
    return config;
}