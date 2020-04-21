module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;

    }

    readMap() {
        this.#$.plugins.forEach(plugin => {
            const plugData = require(plugin)()
            Object.keys(plugData).forEach(key => {
                if (this.#$.map[key] === undefined) {//check if this page already exists
                    console.error(`page ${key} not found`);
                    throw new Error();
                } else {
                    if (Array.isArray(plugData[key])) {
                        this.#$.map[key].push(plugData[key]);
                    } else if (typeof plugData[key] === "object") {
                        this.#$.map[key].push(plugData[key]);
                    }else {
                        console.error(`Expected object | array got ${typeof plugData[key]}`)
                        throw new Error();
                    }
                }
            });
        })
    }
}