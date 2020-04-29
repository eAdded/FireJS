const _path = require("path");
const FsUtil = require("../utils/fs-util");
const PagePath = require("../classes/PagePath");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin);
            Object.keys(plugData).forEach(page => {
                const mapComponent = this.#$.map.get(page);
                if (!mapComponent) //check if this page already exists
                    throw new TypeError(`page ${page} either does not exists or is not mapped.\nHint : Make sure you add \\ before [ and ]`);
                mapComponent.markCustom();
                this.mapPlugin(page, plugData[page], (path, content) => {
                    const pagePath = new PagePath(path, content, this.#$);
                    mapComponent.getPaths().set(path, pagePath);
                    if (this.#$.config.pro)
                        FsUtil.writeFileRecursively(//write content
                            _path.join(this.#$.config.paths.dist, pagePath.getContentPath()),
                            "window.___PAGE_CONTENT___=".concat(JSON.stringify(content))
                        );
                }, reason => {
                    this.#$.cli.error(new Error(`Error in plugin ${plugin}`));
                    throw reason;
                });
            });
        });
        for (const mapComponent of this.#$.map.values()) {
            if (!mapComponent.isCustom()) {
                let path = mapComponent.getPage();
                path = "/" + path.substring(0, path.lastIndexOf(".js"));
                mapComponent.getPaths().set(path, new PagePath(path, undefined, this.#$));
            }
        }
    }

    mapPlugin(page, paths, callback, reject) {
        if (Array.isArray(paths)) {
            paths.forEach(path => {
                if (typeof path === "string") {
                    callback(path, {});
                } else if (path.constructor.name === "AsyncFunction") {
                    path().then(value => {
                        this.mapPlugin(page, value, callback, reject);
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