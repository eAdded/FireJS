import {isAbsolute, join, resolve} from "path"
import {existsSync, mkdirSync, readdirSync} from "fs"
import {$} from "../index";

export default class {
    $: $;

    constructor(globalData: $) {
        this.$ = globalData;
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
        const wasGiven = this.$.args["--conf"];//to store if user gave this arg so that log can be changed
        if (this.$.args["--conf"]) {//tweak conf path
            if (!isAbsolute(this.$.args["--conf"]))
                this.$.args["--conf"] = resolve(process.cwd(), this.$.args["--conf"]);//create absolute path
        } else
            this.$.args["--conf"] = resolve(process.cwd(), `firejs.config.js`);

        return existsSync(this.$.args["--conf"]) ? (() => {///check if config file exists
            this.$.cli.log(`Loading config from ${this.$.args["--conf"]}`);
            return require(this.$.args["--conf"])
        })() : (() => {//if config does not exists just return args
            if (wasGiven)
                this.$.cli.warn(`Config not found at ${this.$.args["--conf"]}. Loading defaults`);
            return {};
        })()
    }

    getConfig(userConfig: any = undefined) {
        this.$.cli.log("Loading configs");
        const config = userConfig || this.getUserConfig();
        config.pro = this.$.args["--pro"] ? true : config.pro || false;
        this.$.args["--pro"] = undefined;
        this.$.cli.log("mode : " + (config.pro ? "production" : "development"))
        config.paths = config.paths || {};
        config.plugins = config.plugins || [];
        this.throwIfNotFound("root dir", config.paths.root = config.paths.root ? this.makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
        this.throwIfNotFound("src dir", config.paths.src = config.paths.src ? this.makeAbsolute(config.paths.root, config.paths.src) : join(config.paths.root, "src"));
        this.throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? this.makeAbsolute(config.paths.root, config.paths.pages) : join(config.paths.src, "pages"));
        //out
        this.makeDirIfNotFound(config.paths.out = config.paths.out ? this.makeAbsolute(config.paths.root, config.paths.out) : join(config.paths.root, "out"));
        this.makeDirIfNotFound(config.paths.dist = config.paths.dist ? this.makeAbsolute(config.paths.root, config.paths.dist) : join(config.paths.out, "dist"));
        this.makeDirIfNotFound(config.paths.cache = config.paths.cache ? this.makeAbsolute(config.paths.root, config.paths.cache) : join(config.paths.out, ".cache"));
        this.makeDirIfNotFound(config.paths.babel = join(config.paths.cache, "babel"));
        config.paths.template = config.paths.template ? this.makeAbsolute(config.paths.root, config.paths.template) : resolve(__dirname, "../../web/template.html")
        this.makeDirIfNotFound(config.paths.lib = config.paths.lib ? this.makeAbsolute(config.paths.root, config.paths.lib) : join(config.paths.dist, "lib"));
        this.makeDirIfNotFound(config.paths.map = config.paths.map ? this.makeAbsolute(config.paths.root, config.paths.map) : join(config.paths.lib, "map"));
        //configs
        this.undefinedIfNotFound(config.paths, "webpack", config.paths.root, "webpack.config.js", "webpack config");
        //static dir
        this.undefinedIfNotFound(config.paths, "static", config.paths.src, "static", "static dir");
        //plugins
        if (!config.noPlugin) {
            this.undefinedIfNotFound(config.paths, "plugins", config.paths.src, "plugins", "plugins dir");
            if (config.paths.plugins)//Only getPlugins when dir exists
                this.getPlugins(config);
        }
        //html template tags
        config.templateTags = config.templateTags || {};
        config.templateTags.script = config.templateTags.script || "<%=SCRIPT=%>";
        config.templateTags.static = config.templateTags.static || "<%=STATIC=%>";
        config.templateTags.head = config.templateTags.head || "<%=HEAD=%>";
        config.templateTags.style = config.templateTags.style || "<%=STYLE=%>";
        config.templateTags.unknown = config.templateTags.unknown || "<%=UNKNOWN=%>";
        //pages
        config.pages = config.pages || {};
        config.pages._404 = config.pages._404 || "404.js"
        return config;
    }

    private makeAbsolute = (root: string, pathTo: string) => {
        return isAbsolute(pathTo) ? pathTo : resolve(root, pathTo);
    }

    private throwIfNotFound = (name: string, pathTo: string) => {
        if (!existsSync(pathTo)) {
            this.$.cli.error(`${name} not found`, pathTo);
            throw new Error();
        }
    }

    private undefinedIfNotFound = (config: {}, property: string, pathRoot: string, name: string, msg: string) => {
        if (config[property]) {
            config[property] = this.makeAbsolute(pathRoot, config[property]);
            this.throwIfNotFound(msg, config[property])
        } else if (!existsSync(config[property] = resolve(pathRoot, name)))
            config[property] = undefined;
    }

    private getPlugins = (config: any) => {
        config.plugins = config.plugins || [];
        config.plugins.forEach((plugin, index) => {
            if (!this.pluginExists(plugin, [config.paths.root])) {
                config.plugins.splice(index, 1);
                this.$.cli.warn(`Plugin ${plugin} is not a valid plugin. Removing...`);
            }
        })
        readdirSync(config.paths.plugins).forEach(plugin => {
            const pPath = join(config.paths.plugins, plugin);
            if (this.pluginExists(pPath))
                config.plugins.push(pPath);
            else
                this.$.cli.warn(`Plugin ${plugin} is not a valid plugin. Removing...`);
        });

    }

    private pluginExists(plugin: string, paths: string[] | undefined = undefined) {
        try {
            require.resolve(plugin, {paths});
            return true;
        } catch (ex) {
            return false;
        }
    }

    private makeDirIfNotFound(path: string) {
        if (!existsSync(path))
            mkdirSync(path);
    }
}