module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    build(page, data) {
        if (this.#$.map[page] === undefined) {//check if this page already exists
            console.error(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`);
            throw new Error();
        } else {
            if (Array.isArray(data)) {
                console.log(data);
            } else {
                console.error(`Expected array got ${typeof plugData[key]}`)
                throw new Error();
            }
        }
    }

}