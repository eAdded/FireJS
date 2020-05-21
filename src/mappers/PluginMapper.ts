import {PathRelatives} from "../index";
import PagePath from "../classes/PagePath";
import MapComponent from "../classes/MapComponent";
import {readdirSync} from "fs";
import {join} from "path";

export interface AsyncFunc {
    (): Promise<PathObject[]>;
}

export type PageObject = string | PathObject | AsyncFunc;

export interface PathObject {
    path: string
    content: any
}

export interface Plugin {
    [key: string]: PageObject[]
}


export function mapPlugins(plugins: string[], map: Map<string, MapComponent>) {
    plugins.forEach(path => {
        const plugin: Plugin = require(path);
        for (const page in plugin) {
            const mapComponent = map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    });
}

export function applyPlugin(mapComponent: MapComponent, rel: PathRelatives, callback: (PagePath) => void) {
    if (mapComponent.plugin)
        this.parsePagePaths(mapComponent.plugin, (path, content) => {
            const pagePath = new PagePath(mapComponent, path, content, rel);
            mapComponent.paths.push(pagePath);
            callback(pagePath);
        }, err => {
            throw err;
        })
    else {//make default page
        let path = mapComponent.Page;
        path = "/" + path.substring(0, path.lastIndexOf(mapComponent.Ext));
        const pagePath = new PagePath(mapComponent, path, {}, rel);
        mapComponent.paths.push(pagePath);//push when dev
        callback(pagePath);
    }
}

export function parsePagePaths(paths: PageObject[], callback, reject) {
    if (Array.isArray(paths)) {
        paths.forEach(pageObject => {
            if (typeof pageObject === "string") {
                callback(<string>pageObject, {});
            } else if (pageObject.constructor.name === "AsyncFunction") {
                (<AsyncFunc>pageObject)().then(pageObjects => {
                    this.parsePagePaths(pageObjects, callback, reject);
                });
            } else if (typeof pageObject === "object") {
                callback(pageObject.path, pageObject.content);
            } else
                reject(new TypeError(`Expected String | AsyncFunction | Object got ${typeof pageObject}`))
        });
    } else {
        reject(new TypeError(`Expected array got ${typeof paths}`));
    }
}

export function getPlugins(pluginsPath: string, otherPlugins: string[]): string[] {
    const plugins = [];
    otherPlugins.forEach(plugin => {
        require.resolve(plugin);
        plugins.push(plugin);
    })
    readdirSync(pluginsPath).forEach(plugin => {
        const pPath = join(pluginsPath, plugin);
        require.resolve(pPath);
        plugins.push(pPath);
    });
    return plugins;
}