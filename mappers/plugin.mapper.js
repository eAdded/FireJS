const _path = require("path");
const FsUtil = require("../utils/fs-util");
const PagePath = require("../classes/PagePath");
const PathArchitect = require("../architects/path.architect");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    mapPlugins() {
        this.#$.config.plugins.forEach(path => {
            this.mapPlugin(path);
        });
    }

    mapPlugin(path) {
        const plugin = require(path);
        for (const page in plugin){
            const mapComponent = this.#$.map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    }

    applyPlugin(mapComponent) {
        const pathArchitect = new PathArchitect(this.#$);
        mapComponent.paths = [];//reset paths
        if (mapComponent.plugin) {
            this.parsePagePaths(mapComponent.plugin, (path, content) => {
                const pagePath = new PagePath(path, content, this.#$);
                if (this.#$.config.pro) {
                    FsUtil.writeFileRecursively(//write content
                        _path.join(this.#$.config.paths.dist, pagePath.getContentPath()),
                        "window.___PAGE_CONTENT___=".concat(JSON.stringify(content))
                    );
                    pathArchitect.writePath(mapComponent, pagePath);//write html file
                } else
                    mapComponent.paths.push(pagePath);//push in dev mode
            }, err => {
                throw err;
            })
        }else {
            //make default page
            let path = mapComponent.getPage();
            path = "/" + path.substring(0, path.lastIndexOf(".js"));
            const pagePath = new PagePath(path, undefined, this.#$);
            if (this.#$.config.pro) {
                pathArchitect.writePath(mapComponent, pagePath);//write html when pro
            } else
                mapComponent.paths.push(pagePath);//push when dev
        }
    }

    parsePagePaths(paths, callback, reject) {
        if (Array.isArray(paths)) {
            paths.forEach(path => {
                if (typeof path === "string") {
                    callback(path, {});
                } else if (path.constructor.name === "AsyncFunction") {
                    path().then(value => {
                        this.parsePagePaths(value, callback, reject);
                    });
                } else if (typeof path === "object") {
                    if (typeof path.path !== "string") {
                        reject(new TypeError(`Expected path:string got ${typeof path.path}`));
                        return;
                    }
                    if (typeof path.content !== "object") {
                        reject(new TypeError(`Expected content:object got ${typeof path.path}`));
                        return;
                    }
                    callback(path.path, path.content);
                } else
                    reject(new TypeError(`Expected String | Object | Array got ${typeof path} in plugin for path ${path}`))
            });
        } else {
            reject(new TypeError(`Expected array got ${typeof paths}`));
        }
    }
}