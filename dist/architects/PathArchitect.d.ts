import MapComponent from "../classes/MapComponent";
import PagePath from "../classes/PagePath";
import { $ } from "../index";
export default class {
    private readonly $;
    constructor(globalData: $);
    writePath(mapComponent: MapComponent, pagePath: PagePath): Promise<unknown>;
}
