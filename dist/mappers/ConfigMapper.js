"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const yaml_1 = require("yaml");
const fs = require("fs");
class default_1 {
    constructor(inputFileSystem = fs, outputFileSystem = fs) {
        this.inputFileSystem = inputFileSystem;
        this.outputFileSystem = outputFileSystem;
    }
    getUserConfig(path) {
        const wasGiven = !!path;
        if (path) { //tweak conf path
            if (!path_1.isAbsolute(path))
                path = path_1.resolve(process.cwd(), path); //create absolute path
        }
        else
            path = path_1.resolve(process.cwd(), `firejs.yml`);
        if (this.inputFileSystem.existsSync(path))
            return yaml_1.parse(this.inputFileSystem.readFileSync(path, "utf8").toString()) || {};
        else if (wasGiven)
            throw new Error(`Config not found at ${path}`);
    }
    getConfig(config = {}) {
        config.paths = config.paths || {};
        this.throwIfNotFound("root dir", config.paths.root = config.paths.root ? this.makeAbsolute(process.cwd(), config.paths.root) : process.cwd());
        this.throwIfNotFound("src dir", config.paths.src = config.paths.src ? this.makeAbsolute(config.paths.root, config.paths.src) : path_1.join(config.paths.root, "src"));
        this.throwIfNotFound("pages dir", config.paths.pages = config.paths.pages ? this.makeAbsolute(config.paths.root, config.paths.pages) : path_1.join(config.paths.src, "pages"));
        //out
        this.makeDirIfNotFound(config.paths.out = config.paths.out ? this.makeAbsolute(config.paths.root, config.paths.out) : path_1.join(config.paths.root, "out"));
        this.makeDirIfNotFound(config.paths.cache = config.paths.cache ? this.makeAbsolute(config.paths.root, config.paths.cache) : path_1.join(config.paths.out, ".cache"));
        this.makeDirIfNotFound(config.paths.fly = config.paths.fly ? this.makeAbsolute(config.paths.root, config.paths.fly) : path_1.join(config.paths.out, "fly"));
        this.makeDirIfNotFound(config.paths.dist = config.paths.dist ? this.makeAbsolute(config.paths.root, config.paths.dist) : path_1.join(config.paths.out, "dist"));
        this.makeDirIfNotFound(config.paths.lib = config.paths.lib ? this.makeAbsolute(config.paths.root, config.paths.lib) : path_1.join(config.paths.dist, "lib"));
        this.makeDirIfNotFound(config.paths.map = config.paths.map ? this.makeAbsolute(config.paths.root, config.paths.map) : path_1.join(config.paths.lib, "map"));
        //template
        config.paths.template = config.paths.template ? this.makeAbsolute(config.paths.root, config.paths.template) : path_1.resolve(__dirname, "../../web/template.html");
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
        this.throwIfNotFound("404 page", path_1.join(config.paths.pages, config.pages["404"] = config.pages["404"] || "404.js"));
        return config;
    }
    makeAbsolute(root, pathTo) {
        return path_1.isAbsolute(pathTo) ? pathTo : path_1.resolve(root, pathTo);
    }
    throwIfNotFound(name, pathTo) {
        if (!this.inputFileSystem.existsSync(pathTo))
            throw new Error(`${name} not found. ${pathTo}`);
    }
    undefinedIfNotFound(object, property, pathRoot, name, msg) {
        if (object[property]) {
            object[property] = this.makeAbsolute(pathRoot, object[property]);
            this.throwIfNotFound(msg, object[property]);
        }
        else if (!this.inputFileSystem.existsSync(object[property] = path_1.resolve(pathRoot, name)))
            object[property] = undefined;
    }
    makeDirIfNotFound(path) {
        if (!this.outputFileSystem.existsSync(path))
            this.outputFileSystem.mkdirp(path, () => {
            });
    }
}
exports.default = default_1;
