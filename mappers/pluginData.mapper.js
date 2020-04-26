const _path = require("path");
const fs = require("fs");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    async map() {
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin)();
            Object.keys(plugData).forEach(page => {
                this.mapPlugin(page, plugData[page]).then();
            });
        });
    }

    mapPlugin(page, paths) {
        return new Promise((resolve, reject) => {
            if (this.#$.map[page] === undefined) //check if this page already exists
                reject(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`);
            else {
                const mapPointer = this.#$.map[page];
                if (Array.isArray(paths)) {
                    paths.forEach(path => {
                        if (typeof path === "string") {
                            mapPointer.paths.push(path);
                            resolve();
                        } else if (path.constructor.name === "AsyncFunction") {
                            path().then(value => {
                                this.addPlugin(page, value).then(resolve).catch(reject);
                            });
                        } else if (typeof path === "object") {
                            if (typeof value.path !== "string") {
                                reject(`Expected path:string got ${typeof value.path}`);
                                return;
                            }
                            if (typeof value.content !== "object") {
                                reject(`Expected content:object got ${typeof value.path}`);
                                return;
                            }
                            this.writePageData(path.path, path.content).then(resolve).catch(reject);
                        } else
                            reject(`Expected String | Object | Array got ${typeof path} in plugin for path ${path}`)
                    });
                } else {
                    reject(`Expected array got ${typeof paths}`);
                }
            }
        });
    }

    writePageData(path, content) {
        return new Promise((resolve, reject) => {
            fs.mkdir(_path.join(this.#$.config.paths.pageData, path.substr(0, path.lastIndexOf("/"))), {recursive: true}, err => {
                if (err)
                    reject(`Error creating dir(s) to path ${path}`);
                else {
                    this.#$.cli.log(`writing page data for path ${path}`);
                    fs.writeFile(_path.join(this.#$.config.paths.pageData, path.concat(".js")), "window.__PAGE_DATA__ =".concat(JSON.stringify(content)), (err) => {
                        if (err)
                            reject(`Error writing page data to path ${path}`);
                        else
                            resolve();
                    })
                }
            })
        });
    }
}