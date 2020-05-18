import {join} from "path"
import {$} from "../index";
import StaticArchitect from "./static.architect"
import {writeFileRecursively} from "../utils/fs-util";
import MapComponent from "../classes/MapComponent";
import PagePath from "../classes/PagePath";

export default class {
    readonly #$;

    constructor(globalData: $) {
        this.#$ = globalData;
    }

    writePath(mapComponent: MapComponent, pagePath: PagePath) {
        const staticArchitect = new StaticArchitect(this.#$);
        const html = staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath));
        return writeFileRecursively(
            join(this.#$.config.paths.dist, pagePath.Path.concat(".html")),
            html
        )
    }
}