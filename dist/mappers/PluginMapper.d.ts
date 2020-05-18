import {$} from "../index";
import MapComponent from "../classes/MapComponent";

export default class {
    private readonly $;
    constructor(globalData: $);
    mapPlugins(): void;
    mapPlugin(path: string): void;
    applyPlugin(mapComponent: MapComponent): void;
    parsePagePaths(paths: any, callback: any, reject: any): void;
}
