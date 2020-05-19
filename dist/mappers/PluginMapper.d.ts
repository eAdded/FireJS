import { $ } from "../index";
import MapComponent from "../classes/MapComponent";
export interface AsyncFunc {
    (): Promise<PathObject[]>;
}
export declare type PageObject = string | PathObject | AsyncFunc;
export interface PathObject {
    path: string;
    content: any;
}
export interface Plugin {
    [key: string]: PageObject[];
}
export default class {
    private readonly $;
    constructor(globalData: $);
    mapPlugins(): void;
    mapPlugin(path: string): void;
    applyPlugin(mapComponent: MapComponent): void;
    parsePagePaths(paths: PageObject[], callback: any, reject: any): void;
}
