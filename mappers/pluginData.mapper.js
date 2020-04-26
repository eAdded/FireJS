const _path = require("path");
const fs = require("fs");
const PathArchitect = require("../architects/path.architect");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    map() {
        const pathArchitect = new PathArchitect(this.#$);
        pathArchitect.readTemplate((err, template) => {
            if (err) {
                this.#$.cli.error("Error while reading template");
                throw err;
            }
            this.#$.config.plugins.forEach(plugin => {
                const plugData = require(plugin)();
                Object.keys(plugData).forEach(page => {
                    const mapComponent = this.#$.map[page];
                    mapComponent.markCustom();
                    this.mapPlugin(page, plugData[page]).then((path, content) => {
                        if (mapComponent.isBuilt()) {
                            pathArchitect.build(page, path, content, template)
                        } else {
                            mapComponent.resolveWhenBuilt(() => {
                                pathArchitect.build(page, path, content, template)
                            })
                        }
                    }).catch((reason => {
                        this.#$.cli.error(new Error(`Error in plugin ${plugin}`), reason);
                    }));
                });
            });
            Object.keys(this.#$.map).forEach(page => {
                const mapComponent = this.#$.map[page];
                if (!mapComponent.isCustom()) {
                    if (mapComponent.isBuilt()) {
                        pathArchitect.build(page, page, undefined, template);
                    } else {
                        mapComponent.resolveWhenBuilt(() => {
                            pathArchitect.build(page, page, undefined, template);
                        })
                    }
                }
            });
        });
    }

    mapPlugin(page, paths) {
        return new Promise((resolve, reject) => {
            if (this.#$.map[page] === undefined) //check if this page already exists
                reject(new TypeError(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`));
            else {
                if (Array.isArray(paths)) {
                    paths.forEach(path => {
                        if (typeof path === "string") {
                            resolve(path, {});
                        } else if (path.constructor.name === "AsyncFunction") {
                            path().then(value => {
                                this.mapPlugin(page, value).then(resolve).catch(reject);
                            });
                        } else if (typeof path === "object") {
                            if (typeof path.path !== "string") {
                                reject(`Expected path:string got ${typeof value.path}`);
                                return;
                            }
                            if (typeof path.content !== "object") {
                                reject(`Expected content:object got ${typeof value.path}`);
                                return;
                            }
                            resolve(path.path, path.content);
                            this.writePageData(path.path, path.content).then(() => {
                                this.#$.cli.log(`Successfully wrote page data for path ${path.path}`);
                            }).catch((ex) => {
                                this.#$.cli.error(`Error writing page data for path ${path.path}`);
                                reject(ex);
                            });
                        } else
                            reject(new TypeError(`Expected String | Object | Array got ${typeof path} in plugin for path ${path}`))
                    });
                } else {
                    reject(new TypeError(`Expected array got ${typeof paths}`));
                }
            }
        });
    }

    writePageData(path, content) {
        return new Promise((resolve, reject) => {
            fs.mkdir(_path.join(this.#$.config.paths.pageData, path.substr(0, path.lastIndexOf("/"))), {recursive: true}, err => {
                if (err)
                    reject(err);
                else {
                    this.#$.cli.log(`writing page data for path ${path}`);
                    fs.writeFile(_path.join(this.#$.config.paths.pageData, path.concat(".js")), "window.__PAGE_DATA__ =".concat(JSON.stringify(content)), (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    })
                }
            })
        });
    }
}