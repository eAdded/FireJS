"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagePath_1 = require("../classes/PagePath");
function mapPlugins(plugins, map) {
    plugins.forEach(path => {
        const plugin = require(path);
        for (const page in plugin) {
            const mapComponent = map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    });
}
exports.mapPlugins = mapPlugins;
function applyPlugin(mapComponent, rel, callback) {
    if (mapComponent.plugin)
        this.parsePagePaths(mapComponent.plugin, (path, content) => {
            const pagePath = new PagePath_1.default(mapComponent, path, content, rel);
            mapComponent.paths.push(pagePath);
            callback(pagePath);
        }, err => {
            throw err;
        });
    else { //make default page
        let path = mapComponent.Page;
        path = "/" + path.substring(0, path.lastIndexOf(mapComponent.Ext));
        const pagePath = new PagePath_1.default(mapComponent, path, {}, rel);
        mapComponent.paths.push(pagePath); //push when dev
        callback(pagePath);
    }
}
exports.applyPlugin = applyPlugin;
function parsePagePaths(paths, callback, reject) {
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
exports.parsePagePaths = parsePagePaths;
