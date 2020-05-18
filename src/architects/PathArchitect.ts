import {join} from "path"
import StaticArchitect from "./StaticArchitect"
import {writeFileRecursively} from "../utils/Fs";
import MapComponent from "../classes/MapComponent";
import PagePath from "../classes/PagePath";
import {$} from "../index";

export default class {
    private readonly $: $;

    constructor(globalData: $) {
        this.$ = globalData;
    }

    writePath(mapComponent: MapComponent, pagePath: PagePath) {
        const staticArchitect = new StaticArchitect(this.$);
        const html = staticArchitect.finalize(staticArchitect.render(mapComponent, pagePath));
        return writeFileRecursively(
            join(this.$.config.paths.dist, pagePath.Path.concat(".html")),
            html
        )
    }
}