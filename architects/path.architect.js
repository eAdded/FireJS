const _path = require("path");
const fs = require("fs");
const StaticArchitect = require("./static.architect");
const FsUtil = require("../utils/fs-util");
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    writePath(mapComponent, pagePath) {
        const staticArchitect = new StaticArchitect(this.#$);
        const html = staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath));

        return FsUtil.writeFileRecursively(
            _path.join(this.#$.config.paths.dist, pagePath.getPath().concat(".html")),
            html
        )
    }

}