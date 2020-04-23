module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    build(page, paths) {
        if (this.#$.map[page] === undefined) {//check if this page already exists
            console.error(`page ${page} either does not exists or is not mapped. Hint : Make sure to add ${page} in map.`);
            throw new Error();
        } else {
            try {
                paths.forEach(page => {
                    if (typeof page === "string") {

                        //        const lib_relative = this.#$.config.paths.lib.replace(this.#$.config.paths.dist, "");
                        //const template = fs.readFileSync(path.resolve(__dirname, '../web/template.html')).toString().replace("</body>",
                        //             `<script src="${lib_relative}/React.js"></script><script src="${lib_relative}/ReactDOM.js"></script></body>`);
                    }
                });
            } catch (e) {
                if (!Array.isArray(paths)) {
                    console.error(`Expected array got ${typeof paths}`)
                    throw new Error();
                } else
                    throw e;
            }
        }
    }

}