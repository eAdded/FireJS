import {isAbsolute, join, resolve} from "path"
import {parse as parseYaml} from "yaml";
import * as fs from "fs"

export interface Config {
    pro?: boolean,          //production mode when true, dev mode when false
    verbose?: boolean,
    logMode?: "plain" | "silent",
    disablePlugins?: boolean,
    paths?: {               //paths absolute or relative to root
        root?: string,      //project root, default : process.cwd()
        src?: string,       //src dir, default : root/src
        pages?: string,     //pages dir, default : root/src/pages
        dist?: string,      //production dist, default : root/dist
        template?: string,  //template file, default : inbuilt template file
        lib?: string,       //dir where chunks are exported, default : root/out/dist/lib
        map?: string,       //dir where chunk map and page data is exported, default : root/out/dist/lib/map
        static?: string,    //dir where page static elements are stored eg. images, default : root/src/static
        plugins?: string,   //plugins dir, default : root/src/plugins
    },
    templateTags?: TemplateTags,
    pages?: ExplicitPages
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

export default class {
    inputFileSystem
    outputFileSystem

    constructor(inputFileSystem = fs, outputFileSystem = fs) {
        this.inputFileSystem = inputFileSystem;
        this.outputFileSystem = outputFileSystem;
    }

    public getUserConfig(path: string): Config | never {
        const wasGiven = !!path;
        if (path) {//tweak conf path
            if (!isAbsolute(path))
                path = resolve(process.cwd(), path);//create absolute path
        } else
            path = resolve(process.cwd(), `firejs.yml`);

        if (this.inputFileSystem.existsSync(path))
            return parseYaml(this.inputFileSystem.readFileSync(path, "utf8").toString()) || {};
        else if (wasGiven)
            throw new Error(`Config not found at ${path}`)
        else
            return {}
    }

    public getConfig(config: Config = {}): Config {
        config.paths = config.paths || {};
        this.throwIfNotFound("root dir", config.paths.root = config.paths.root ? this.makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
        this.throwIfNotFound("src dir", config.paths.src = config.paths.src ? this.makeAbsolute(config.paths.root, config.paths.src) : join(config.paths.root, "src"));
        this.throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? this.makeAbsolute(config.paths.root, config.paths.pages) : join(config.paths.src, "pages"));
        //out
        this.makeDirIfNotFound(config.paths.dist = config.paths.dist ? this.makeAbsolute(config.paths.root, config.paths.dist) : join(config.paths.root, "dist"));
        config.paths.template = config.paths.template ? this.makeAbsolute(config.paths.root, config.paths.template) : resolve(__dirname, "../../web/template.html")
        this.makeDirIfNotFound(config.paths.lib = config.paths.lib ? this.makeAbsolute(config.paths.root, config.paths.lib) : join(config.paths.dist, "lib"));
        this.makeDirIfNotFound(config.paths.map = config.paths.map ? this.makeAbsolute(config.paths.root, config.paths.map) : join(config.paths.lib, "map"));
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

    private makeAbsolute(root: string, pathTo: string) {
        return isAbsolute(pathTo) ? pathTo : resolve(root, pathTo);
    }

    private throwIfNotFound(name: string, pathTo: string) {
        if (!this.inputFileSystem.existsSync(pathTo))
            throw new Error(`${name} not found. ${pathTo}`);
    }

    private undefinedIfNotFound<T extends { [key: string]: string }, K extends keyof T>(object: T, property: K, pathRoot: string, name: string, msg: string) {
        if (object[property]) {
            object[property] = this.makeAbsolute(pathRoot, object[property]) as T[K];
            this.throwIfNotFound(msg, object[property])
        } else if (!this.inputFileSystem.existsSync(object[property] = resolve(pathRoot, name) as T[K]))
            object[property] = undefined;
    }


    private makeDirIfNotFound(path: string) {
        if (!this.outputFileSystem.existsSync(path))
            this.outputFileSystem.mkdirp(path, () => {

            });
    }
}