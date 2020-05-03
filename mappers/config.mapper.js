const path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    static getArgs = () => {
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

    getUserConfig() {
        const wasGiven = this.#$.args["--conf"];//to store if user gave this arg so that log can be changed
        if (this.#$.args["--conf"]) {//tweak conf path
            if (!path.isAbsolute(this.#$.args["--conf"]))
                this.#$.args["--conf"] = path.resolve(process.cwd(), this.#$.args["--conf"]);//create absolute path
        } else
            this.#$.args["--conf"] = path.resolve(process.cwd(), `firejs.config.js`);

        return fs.existsSync(this.#$.args["--conf"]) ? (() => {///check if config file exists
            this.#$.cli.log(`Loading config from ${this.#$.args["--conf"]}`);
            return require(this.#$.args["--conf"])
        })() : (() => {//if config does not exists just return args
            if (wasGiven)
                this.#$.cli.warn(`Config not found at ${this.#$.args["--conf"]}. Loading defaults`);
            return {};
        })()
    }

    #makeAbsolute = (root, pathTo) => {
        return path.isAbsolute(pathTo) ? pathTo : path.resolve(root, pathTo);
    }

    #throwIfNotFound = (name, pathTo) => {
        if (!fs.existsSync(pathTo)) {
            this.#$.cli.error(`${name} not found`);
            throw new Error();
        }
    }

    #undefinedIfNotFound = (config, property, pathRoot, name, msg) => {
        if (config[property]) {
            this.#throwIfNotFound(msg, config[property])
            config[property] = this.#$.#makeAbsolute(pathRoot, config[property]);
        } else if (!fs.existsSync(config[property] = path.join(pathRoot, name)))
            config[property] = undefined;
    }

    #getPlugins = (config) => {
        config.plugins = config.plugins || [];
        config.plugins.forEach((plugin, index) => {
            if (!this.#pluginExists(plugin, [config.paths.root])) {
                config.plugins.splice(index, 1);
                this.#$.cli.warn(`Plugin ${plugin} is not a valid plugin. Removing...`);
            }
        })
        fs.readdirSync(config.paths.plugins).forEach(plugin => {
            const pPath = path.join(config.paths.plugins, plugin);
            if (this.#pluginExists(pPath))
                config.plugins.push(pPath);
            else
                this.#$.cli.warn(`Plugin ${plugin} is not a valid plugin. Removing...`);
        });

    }

    #pluginExists = (plugin, paths) => {
        try {
            require.resolve(plugin, {paths});
            return true;
        } catch (ex) {
            return false;
        }
    }

    #makeDirIfNotFound = (path) => {
        if (!fs.existsSync(path))
            fs.mkdirSync(path);
    }
    getConfig = (userConfig) => {
        this.#$.cli.log("Loading configs");
        const config = userConfig || this.getUserConfig();
        config.pro = this.#$.args["--pro"] ? true : config.pro || false;
        this.#$.args["--pro"] = undefined;
        this.#$.cli.log("mode : " + (config.pro ? "production" : "development"))
        config.paths = config.paths || {};
        config.plugins = config.plugins || [];
        this.#throwIfNotFound("root dir", config.paths.root = config.paths.root ? this.#makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
        this.#throwIfNotFound("src dir", config.paths.src = config.paths.src ? this.#makeAbsolute(config.paths.root, config.paths.src) : path.join(config.paths.root, "src"));
        this.#throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? this.#makeAbsolute(config.paths.root, config.paths.pages) : path.join(config.paths.src, "pages"));
        //out
        this.#makeDirIfNotFound(config.paths.out = config.paths.out ? this.#makeAbsolute(config.paths.root, config.paths.out) : path.join(config.paths.root, "out"));
        this.#makeDirIfNotFound(config.paths.dist = config.paths.dist ? this.#makeAbsolute(config.paths.out, config.paths.dist) : path.join(config.paths.out, "dist"));
        this.#makeDirIfNotFound(config.paths.cache = config.paths.cache ? this.#makeAbsolute(config.paths.out, config.paths.cache) : path.join(config.paths.out, ".cache"));
        this.#makeDirIfNotFound(config.paths.babel = path.join(config.paths.cache, "babel"));
        config.paths.template = config.paths.template ? this.#makeAbsolute(config.paths.root, config.paths.template) : path.resolve(config.paths.root, "web/template.html")
        this.#makeDirIfNotFound(config.paths.lib = config.paths.lib ? this.#makeAbsolute(config.paths.dist, config.paths.lib) : path.join(config.paths.dist, "__LIB__"));
        this.#makeDirIfNotFound(config.paths.map = config.paths.map ? this.#makeAbsolute(config.paths.lib, config.paths.map) : path.join(config.paths.lib, "__MAP__"));
        //configs
        this.#undefinedIfNotFound(config.paths, "webpack", config.paths.root, "webpack.config.js", "webpack config");
        //plugins
        if (!config.noPlugin) {
            this.#undefinedIfNotFound(config.paths, "plugins", config.paths.src, "plugins", "plugins dir");
            if (config.paths.plugins)//Only getPlugins when dir exists
                this.#getPlugins(config);
        }
        //html template tags
        config.templateTags = config.templateTags || {};
        config.templateTags.script = config.templateTags.script || "<%=SCRIPT=%>";
        config.templateTags.static = config.templateTags.static || "<%=STATIC=%>";
        config.templateTags.head = config.templateTags.head || "<%=HEAD=%>";
        config.templateTags.style = config.templateTags.style || "<%=STYLE=%>";
        config.templateTags.unknown = config.templateTags.unknown || "<%=UNKNOWN=%>";
        return config;
    }
}