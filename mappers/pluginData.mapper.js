const _path = require("path");
const fs = require("fs");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    mapAndBuild(template, pathArchitect) {
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin)();
            Object.keys(plugData).forEach(page => {
                this.applyPlugin(page, plugData[page], template, pathArchitect);
            });
        });
    }

    applyPlugin(page, paths, template, pathArchitect) {
        if (this.#$.map[page] === undefined) {//check if this page already exists
            console.error(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`);
            throw new Error();
        } else {
            this.#$.map[page].didRender = true; // this helps in telling which paths have been already rendered
            if (Array.isArray(paths)) {
                paths.forEach(path => {
                    if (typeof path === "string") {
                        pathArchitect.build(page, path, undefined, template);
                    } else if (path.constructor.name === "AsyncFunction") {
                        path().then(value => {
                            if (Array.isArray(value)) {
                                value.forEach(val => {
                                    checkValidObject(val)
                                    this.writePageData(val.path, val.content);
                                    pathArchitect.build(page, val.path, val.content, template)
                                })
                            } else if (typeof value === "object") {
                                checkValidObject(value);
                                this.writePageData(value.path, value.content);
                                pathArchitect.build(page, value.path, value.content, template)
                            } else {
                                this.#$.cli.error(`Expected Array got ${typeof path} in plugin async for path ${path}`)
                                throw new Error();
                            }
                        });
                    } else if (typeof path === "object") {
                        checkValidObject(path);
                        this.writePageData(path.path, path.content);
                        pathArchitect.build(page, path.path, path.content, template)
                    } else {
                        this.#$.cli.error(`Expected String | Object | Array got ${typeof path} in plugin for path ${path}`)
                        throw new Error();
                    }
                });
            } else {
                console.error(`Expected array got ${typeof paths}`)
                throw new Error();
            }
        }
    }

    writePageData(path, content) {
        fs.mkdir(_path.join(this.#$.config.paths.pageData, path.substr(0, path.lastIndexOf("/"))), {recursive: true}, err => {
            if (err) {
                this.#$.cli.error(`Error creating dir(s) to path ${path}`);
                throw err;
            }
            this.#$.cli.log(`writing page data for path ${path}`);
            fs.writeFile(_path.join(this.#$.config.paths.pageData, path.concat(".js")), "window.__PAGE_DATA__ =".concat(JSON.stringify(content)), (err) => {
                if (err) {
                    this.#$.cli.error(`Error writing page data to path ${path}`);
                    throw err;
                }
            })
        })
    }
}

function checkValidObject(value) {
    if (typeof value.path !== "string") {
        console.error(`Expected path:string got ${typeof value.path}`)
        throw new Error();
    }
    if (typeof value.content !== "object") {
        console.error(`Expected content:object got ${typeof value.path}`)
        throw new Error();
    }
}