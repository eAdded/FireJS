const _path = require("path");
const FsUtil = require("../utils/fs-util");
const StaticArchitect = require("../architects/static.architect");
const PagePath = require("../classes/PagePath");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const staticArchitect = new StaticArchitect(this.#$);
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin);
            Object.keys(plugData).forEach(page => {
                const mapComponent = this.#$.map.get(page);
                mapComponent.markCustom();
                this.mapPlugin(page, plugData[page], (path, content) => {
                    mapComponent.getPaths().push(new PagePath(path, content));
                    if (this.#$.config.pro) //static rendering only required when pro
                        mapComponent.resolveOnSemiBuild(() => {
                            staticArchitect.createStatic(mapComponent, content);
                        });
                }, reason => {
                    this.#$.cli.error(new Error(`Error in plugin ${plugin}`));
                    throw reason;
                });
            });
        });
        for (const mapComponent of this.#$.map.values()) {
            if (!mapComponent.isCustom()) {
                mapComponent.getPaths().push(new PagePath(mapComponent.getPage()));
                if (this.#$.config.pro) //static rendering only required when pro
                    mapComponent.resolveOnSemiBuild(() => {
                        staticArchitect.createStatic(mapComponent);
                    });
            }
        }
    }

    mapPlugin(page, paths, callback, reject) {
        if (!this.#$.map.has(page)) //check if this page already exists
            reject(new TypeError(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`));
        else {
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
}