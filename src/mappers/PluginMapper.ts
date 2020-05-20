import {$} from "../index";
import PagePath from "../classes/PagePath";
import MapComponent from "../classes/MapComponent";

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

export default class {
    private readonly $: $;

    constructor(globalData: $) {
        this.$ = globalData;
    }

    mapPlugins() {
        this.$.config.plugins.forEach(path => {
            this.mapPlugin(path);
        });
    }

    mapPlugin(path: string) {
        const plugin: Plugin = require(path);
        for (const page in plugin) {
            const mapComponent = this.$.map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    }

    applyPlugin(mapComponent: MapComponent, callback: (PagePath) => void) {
        if (mapComponent.plugin)
            this.parsePagePaths(mapComponent.plugin, (path, content) => {
                const pagePath = new PagePath(mapComponent, path, content, this.$);
                mapComponent.paths.push(pagePath);
                callback(pagePath);
            }, err => {
                throw err;
            })
        else {//make default page
            let path = mapComponent.Page;
            path = "/" + path.substring(0, path.lastIndexOf(mapComponent.Ext));
            const pagePath = new PagePath(mapComponent, path, {}, this.$);
            mapComponent.paths.push(pagePath);//push when dev
            callback(pagePath);
        }
    }

    parsePagePaths(paths: PageObject[], callback, reject) {
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
}