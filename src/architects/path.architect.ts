import {join} from "path"
import {$} from "../index";

const StaticArchitect = require("./static.architect");
const FsUtil = require("../utils/fs-util");
export default class {
    #$;

    constructor(globalData: $) {
        this.#$ = globalData;
    }

    writePath(mapComponent, pagePath) {
        const staticArchitect = new StaticArchitect(this.#$);
        const html = staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath));
        return FsUtil.writeFileRecursively(
            join(this.#$.config.paths.dist, pagePath.getPath().concat(".html")),
            html
        )
    }
}