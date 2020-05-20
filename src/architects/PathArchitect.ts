import {join} from "path"
import StaticArchitect from "./StaticArchitect"
import {writeFileRecursively} from "../utils/Fs";
import MapComponent from "../classes/MapComponent";
import PagePath from "../classes/PagePath";
import {$} from "../index";

export default class {
    private readonly $: $;
    private readonly staticArchitect

    constructor($: $) {
        this.$ = $;
        this.staticArchitect = new StaticArchitect($)
    }

    writePath(mapComponent: MapComponent, pagePath: PagePath) {
        return writeFileRecursively(
            join(this.$.config.paths.dist, pagePath.Path.concat(".html")),
            this.staticArchitect.finalize(this.staticArchitect.render(mapComponent.chunkGroup, pagePath))
        )
    }
}