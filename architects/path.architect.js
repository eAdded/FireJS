const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    writePath(mapComponent, path) {
        path = path || mapComponent.getPage();
        const {dir, name} = _path.parse(_path.join(this.#$.config.paths.dist, path))
        fs.mkdir(dir, {recursive: true}, err => {
            if (err) {
                this.#$.cli.error(`Error creating dir ${dir} of path ${path} for page ${mapComponent.page}`);
                throw new Error();
            }
            fs.writeFile(_path.join(dir, name + ".html"), mapComponent.template, err => {
                if (err) {
                    this.#$.cli.error(`Error writing path ${path} for page ${mapComponent.page}`);
                    throw new Error();
                }
                this.#$.cli.ok(`Path ${path} for page ${mapComponent.page} successfully written`);
            });
        })
    }


}