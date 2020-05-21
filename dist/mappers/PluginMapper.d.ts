import { PathRelatives } from "../index";
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
export declare function mapPlugins(plugins: string[], map: Map<string, MapComponent>): void;
export declare function applyPlugin(mapComponent: MapComponent, rel: PathRelatives, callback: (PagePath: any) => void): void;
export declare function parsePagePaths(paths: PageObject[], callback: any, reject: any): void;
export declare function getPlugins(pluginsPath: string): string[];
export declare function resolveCustomPlugins(otherPlugins: string[], rootDir: string): string[];
