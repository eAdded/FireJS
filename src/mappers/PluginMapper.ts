import {PathRelatives} from "../index";
import PagePath from "../classes/PagePath";
import MapComponent from "../classes/Page";
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
        const plug = require(path);
        const plugin: Plugin = plug.default || plug;
        for (const page in plugin) {
            const mapComponent = map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    });
}

export function addDefaultPlugins(map: Map<string, MapComponent>) {
    for (const mapComponent of map.values()) {
        if (!mapComponent.plugin) {
            let path = mapComponent.Page;
            mapComponent.plugin = ["/" + path.substring(0, path.lastIndexOf("."))]
        }
    }
}

export function applyPlugin(mapComponent: MapComponent, rel: PathRelatives, callback: (pagePath: PagePath, index: number) => void) {
    this.parsePagePaths(mapComponent.plugin, (path, content, index) => {
        const pagePath = new PagePath(mapComponent, path, content, rel);
        mapComponent.paths.push(pagePath);
        callback(pagePath);
    }, err => {
        throw err;
    })
}

export function parsePagePaths(paths: PageObject[], callback, reject, index = undefined) {
    if (paths instanceof Array) {
        paths.forEach((pageObject, i) => {
            if (typeof pageObject === "string") {
                callback(<string>pageObject, {}, index || i);
            } else if (pageObject.constructor.name === "AsyncFunction") {
                (<AsyncFunc>pageObject)().then(pageObjects => {
                    this.parsePagePaths(pageObjects, callback, reject, index || i);
                });
            } else if (typeof pageObject === "object") {
                callback(pageObject.path, pageObject.content, index || i);
            } else
                reject(new TypeError(`Expected String | AsyncFunction | Object got ${typeof pageObject}`))
        });
    } else {
        reject(new TypeError(`Expected array got ${typeof paths}`));
    }
}

export function getPlugins(pluginsPath: string): string[] {
    const plugins = [];
    readdirSync(pluginsPath).forEach(plugin => {
        const pPath = join(pluginsPath, plugin);
        require.resolve(pPath);
        plugins.push(pPath);
    });
    return plugins;
}

export function resolveCustomPlugins(otherPlugins: string[], rootDir: string): string[] {
    const plugins = [];
    otherPlugins.forEach(plugin => {
        plugins.push(require.resolve(plugin, {paths: [rootDir]}));
    })
    return plugins;
}