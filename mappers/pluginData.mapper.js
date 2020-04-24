const PathArchitect = require("../architects/path.architect");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    mapAndBuild() {
        const pathArchitect = new PathArchitect(this.#$);
        const template = pathArchitect.readTemplate();
        this.#$.config.plugins.forEach(plugin => {
            const plugData = require(plugin)();
            Object.keys(plugData).forEach(page => {
                this.applyPlugin(page,plugData[page],template,pathArchitect);
            });
        });
        //render those pages which were not told by user
        Object.keys(this.#$.map).forEach(page => {
            if (!page.didRender) {
                this.#$.map[page].didRender = true;
                pathArchitect.build(page, page.substr(0,page.lastIndexOf(".")), {}, template);
            }
        })
    }

    applyPlugin(page,paths,template,pathArchitect){
        if (this.#$.map[page] === undefined) {//check if this page already exists
            console.error(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`);
            throw new Error();
        } else {
            this.#$.map[page].didRender = true; // this helps in telling which paths have been already rendered
            if (Array.isArray(paths)) {
                paths.forEach(path => {
                    if (typeof path === "string") {
                        pathArchitect.build(page, path, {}, template);
                    } else if (path.constructor.name === "AsyncFunction") {
                        path().then(value => {
                            checkValidObject(value)
                            pathArchitect.build(page, value.path, value.content, template)
                        });
                    } else if (typeof path === "object") {
                        checkValidObject(path);
                        pathArchitect.build(page, path.path, path.content, template)
                    }
                });
            } else {
                console.error(`Expected array got ${typeof paths}`)
                throw new Error();
            }
        }
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