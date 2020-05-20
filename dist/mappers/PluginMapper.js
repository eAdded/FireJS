"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagePath_1 = require("../classes/PagePath");
class default_1 {
    constructor(globalData) {
        this.$ = globalData;
    }
    mapPlugins() {
        this.$.config.plugins.forEach(path => {
            this.mapPlugin(path);
        });
    }
    mapPlugin(path) {
        const plugin = require(path);
        for (const page in plugin) {
            const mapComponent = this.$.map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    }
    applyPlugin(mapComponent, callback) {
        if (mapComponent.plugin)
            this.parsePagePaths(mapComponent.plugin, (path, content) => {
                const pagePath = new PagePath_1.default(mapComponent, path, content, this.$);
                mapComponent.paths.push(pagePath);
                callback(pagePath);
            }, err => {
                throw err;
            });
        else { //make default page
            let path = mapComponent.Page;
            path = "/" + path.substring(0, path.lastIndexOf(mapComponent.Ext));
            const pagePath = new PagePath_1.default(mapComponent, path, {}, this.$);
            mapComponent.paths.push(pagePath); //push when dev
            callback(pagePath);
        }
    }
    parsePagePaths(paths, callback, reject) {
        if (Array.isArray(paths)) {
            paths.forEach(pageObject => {
                if (typeof pageObject === "string") {
                    callback(pageObject, {});
                }
                else if (pageObject.constructor.name === "AsyncFunction") {
                    pageObject().then(pageObjects => {
                        this.parsePagePaths(pageObjects, callback, reject);
                    });
                }
                else if (typeof pageObject === "object") {
                    callback(pageObject.path, pageObject.content);
                }
                else
                    reject(new TypeError(`Expected String | AsyncFunction | Object got ${typeof pageObject}`));
            });
        }
        else {
            reject(new TypeError(`Expected array got ${typeof paths}`));
        }
    }
}
exports.default = default_1;
