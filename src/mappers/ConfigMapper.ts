import {isAbsolute, join, resolve} from "path"
import {existsSync, mkdirSync} from "fs"
import {cloneDeep} from "lodash"
import Cli from "../utils/Cli";

export interface Config {
    pro?: boolean,          //production mode when true, dev mode when false
    paths?: {               //paths absolute or relative to root
        root?: string,      //project root, default : process.cwd()
        src?: string,       //src dir, default : root/src
        pages?: string,     //pages dir, default : root/src/pages
        out?: string,       //output dir, default : root/out
        dist?: string,      //production dist, default : root/out/dist
        babel?: string,     //fire js production babel cache, default : root/out/babel
        template?: string,  //template file, default : inbuilt template file
        lib?: string,       //dir where chunks are exported, default : root/out/dist/lib
        map?: string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
        webpack?: string,   //webpack config file, default : root/webpack.config.ts
        static?: string,    //dir where page static elements are stored eg. images, default : root/src/static
        plugins?: string,   //plugins dir, default : root/src/plugins
    },
    plugins?: string[],     //plugins, default : []
    templateTags?: TemplateTags,
    pages?: ExplicitPages
}

export interface Args {
    "--pro"?: boolean,              //Production Mode
    "--conf"?: string,              //Path to Config file
    "--verbose"?: boolean,          //Log Webpack Stat
    "--plain"?: boolean,            //Log without styling i.e colors and symbols
    "--silent"?: boolean,           //Log errors only
    "--disable-plugins"?: boolean   //Disable plugins
    "--help"?: boolean              //Help
}

export interface ExplicitPages {
    "404"?: string       //404 page, default : 404.js
}

export interface TemplateTags {
    script?: string,    //this is replaced by all page scripts, default : "<%=SCRIPT=%>"
    static?: string,    //this is replaced by static content enclosed in <div id="root"></div>, default : "<%=STATIC=%>"
    head?: string,      //this is replaced by static head tags i.e tags in Head Component, default : "<%=HEAD=%>"
    style?: string,     //this is replaced by all page styles, default : "<%=STYLE=%>"
    unknown?: string    //files imported in pages other than [js,css] go here. Make sure you use a webpack loader for these files, default : "<%=UNKNOWN=%>"

}

export function getArgs(): Args {
    return require("arg")({
        //Types
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--plain": Boolean,
        "--silent": Boolean,
        "--disable-plugins": Boolean,
        "--help": Boolean,
        //Aliases
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "-s": "--silent",
        "-h": "--help",
    })
}

export default class {
    private readonly cli: Cli;
    private readonly args: Args;

    constructor(cli, args) {
        this.cli = cli;
        this.args = args;
    }

    getUserConfig() {
        const wasGiven = this.args["--conf"];//to store if user gave this arg so that log can be changed
        if (this.args["--conf"]) {//tweak conf path
            if (!isAbsolute(this.args["--conf"]))
                this.args["--conf"] = resolve(process.cwd(), this.args["--conf"]);//create absolute path
        } else
            this.args["--conf"] = resolve(process.cwd(), `firejs.config.js`);

        return existsSync(this.args["--conf"]) ? (() => {///check if config file exists
            this.cli.log(`Loading config from ${this.args["--conf"]}`);
            const config = require(this.args["--conf"]);
            return config.default || config;
        })() : (() => {//if config does not exists just return args
            if (wasGiven)
                this.cli.warn(`Config not found at ${this.args["--conf"]}. Loading defaults`);
            return {};
        })()
    }

    getConfig(userConfig: Config | undefined = undefined): Config {
        this.cli.log("Loading configs");
        const config: Config = userConfig ? cloneDeep(userConfig) : this.getUserConfig();
        config.pro = this.args["--pro"] ? true : config.pro || false;
        this.cli.log("mode : " + (config.pro ? "production" : "development"))
        config.paths = config.paths || {};
        this.throwIfNotFound("root dir", config.paths.root = config.paths.root ? this.makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
        this.throwIfNotFound("src dir", config.paths.src = config.paths.src ? this.makeAbsolute(config.paths.root, config.paths.src) : join(config.paths.root, "src"));
        this.throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? this.makeAbsolute(config.paths.root, config.paths.pages) : join(config.paths.src, "pages"));
        //out
        this.makeDirIfNotFound(config.paths.out = config.paths.out ? this.makeAbsolute(config.paths.root, config.paths.out) : join(config.paths.root, "out"));
        this.makeDirIfNotFound(config.paths.dist = config.paths.dist ? this.makeAbsolute(config.paths.root, config.paths.dist) : join(config.paths.out, "dist"));
        this.makeDirIfNotFound(config.paths.babel = join(config.paths.out, "babel"));
        config.paths.template = config.paths.template ? this.makeAbsolute(config.paths.root, config.paths.template) : resolve(__dirname, "../../web/template.html")
        this.makeDirIfNotFound(config.paths.lib = config.paths.lib ? this.makeAbsolute(config.paths.root, config.paths.lib) : join(config.paths.dist, "lib"));
        this.makeDirIfNotFound(config.paths.map = config.paths.map ? this.makeAbsolute(config.paths.root, config.paths.map) : join(config.paths.lib, "map"));
        //configs
        this.undefinedIfNotFound(config.paths, "webpack", config.paths.root, "webpack.config.ts", "webpack config");
        //static dir
        this.undefinedIfNotFound(config.paths, "static", config.paths.src, "static", "static dir");
        //plugins
        this.undefinedIfNotFound(config.paths, "plugins", config.paths.src, "plugins", "plugins dir");
        //html template tags
        config.templateTags = config.templateTags || {};
        config.templateTags.script = config.templateTags.script || "<%=SCRIPT=%>";
        config.templateTags.static = config.templateTags.static || "<%=STATIC=%>";
        config.templateTags.head = config.templateTags.head || "<%=HEAD=%>";
        config.templateTags.style = config.templateTags.style || "<%=STYLE=%>";
        config.templateTags.unknown = config.templateTags.unknown || "<%=UNKNOWN=%>";
        //pages
        config.pages = config.pages || {};
        this.throwIfNotFound("404 page", join(config.paths.pages, config.pages["404"] = config.pages["404"] || "404.js"));
        return config;
    }

    private makeAbsolute = (root: string, pathTo: string) => {
        return isAbsolute(pathTo) ? pathTo : resolve(root, pathTo);
    }

    private throwIfNotFound = (name: string, pathTo: string) => {
        if (!existsSync(pathTo)) {
            this.cli.error(`${name} not found`, pathTo);
            throw new Error();
        }
    }

    private undefinedIfNotFound<T extends { [key: string]: string }, K extends keyof T>(object: T, property: K, pathRoot: string, name: string, msg: string) {
        if (object[property]) {
            object[property] = this.makeAbsolute(pathRoot, object[property]) as T[K];
            this.throwIfNotFound(msg, object[property])
        } else if (!existsSync(object[property] = resolve(pathRoot, name) as T[K]))
            object[property] = undefined;
    }


    private makeDirIfNotFound(path: string) {
        if (!existsSync(path))
            mkdirSync(path);
    }
}