"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagePath_1 = require("../classes/PagePath");
const fs_1 = require("fs");
const path_1 = require("path");
function mapPlugins(plugins, map) {
    plugins.forEach(path => {
        const plug = require(path);
        const plugin = plug.default || plug;
        for (const page in plugin) {
            const mapComponent = map.get(page);
            if (!mapComponent) //check if this page exists
                throw new TypeError(`page ${page} either does not exists or is not mapped`);
            mapComponent.plugin = plugin[page];
        }
    });
}
exports.mapPlugins = mapPlugins;
function addDefaultPlugins(map) {
    for (const mapComponent of map.values()) {
        if (!mapComponent.plugin) {
            let path = mapComponent.Page;
            mapComponent.plugin = ["/" + path.substring(0, path.lastIndexOf("."))];
        }
    }
}
exports.addDefaultPlugins = addDefaultPlugins;
function applyPlugin(mapComponent, rel, callback) {
    this.parsePagePaths(mapComponent.plugin, (path, content, index) => {
        const pagePath = new PagePath_1.default(mapComponent, path, content, rel);
        mapComponent.paths.push(pagePath);
        callback(pagePath);
    }, err => {
        throw err;
    });
}
exports.applyPlugin = applyPlugin;
function parsePagePaths(paths, callback, reject, index = undefined) {
    if (paths instanceof Array) {
        paths.forEach((pageObject, i) => {
            if (typeof pageObject === "string") {
                callback(pageObject, {}, index || i);
            }
            else if (pageObject.constructor.name === "AsyncFunction") {
                pageObject().then(pageObjects => {
                    this.parsePagePaths(pageObjects, callback, reject, index || i);
                });
            }
            else if (typeof pageObject === "object") {
                callback(pageObject.path, pageObject.content, index || i);
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
function getPlugins(pluginsPath) {
    const plugins = [];
    fs_1.readdirSync(pluginsPath).forEach(plugin => {
        const pPath = path_1.join(pluginsPath, plugin);
        require.resolve(pPath);
        plugins.push(pPath);
    });
    return plugins;
}
exports.getPlugins = getPlugins;
function resolveCustomPlugins(otherPlugins, rootDir) {
    const plugins = [];
    otherPlugins.forEach(plugin => {
        plugins.push(require.resolve(plugin, { paths: [rootDir] }));
    });
    return plugins;
}
exports.resolveCustomPlugins = resolveCustomPlugins;
