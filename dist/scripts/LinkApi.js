"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadMap(url) {
    const map_script = document.createElement("script");
    map_script.src = getMapUrl(url);
    document.head.appendChild(map_script);
    return map_script;
}
exports.loadMap = loadMap;
function preloadPage(url, callback) {
    const map_script = loadMap(url);
    map_script.onload = () => {
        preloadChunks();
        callback();
    };
    map_script.onerror = _ => {
        document.head.removeChild(map_script);
        const _404 = document.createElement("script");
        // @ts-ignore
        _404.src = getMapUrl(window.__PAGES__._404); //make preloaded js to execute
        _404.onload = map_script.onload;
        document.head.appendChild(_404);
    };
}
exports.preloadPage = preloadPage;
function getMapUrl(url) {
    // @ts-ignore
    return `/${window.__MAP_REL__}${url === "/" ? "/index" : url}.map.js`;
}
exports.getMapUrl = getMapUrl;
function preloadChunks() {
    // @ts-ignore
    window.__MAP__.chunks.forEach(chunk => {
        const preloadLink = document.createElement("link");
        // @ts-ignore
        preloadLink.href = `/${window.__LIB_REL__}/` + chunk;
        preloadLink.rel = "preload";
        preloadLink.as = "script"; //this preloads script before hand
        document.head.appendChild(preloadLink);
    });
}
exports.preloadChunks = preloadChunks;
function loadChunks() {
    // @ts-ignore
    window.__MAP__.chunks.forEach(chunk => {
        const preloadedScript = document.createElement("script");
        // @ts-ignore
        preloadedScript.src = `/${window.__LIB_REL__}/` + chunk; //make preloaded js to execute
        document.head.appendChild(preloadedScript);
    });
}
exports.loadChunks = loadChunks;
function loadPage(url) {
    const sc = loadMap(url);
    sc.onload = () => {
        loadChunks();
    };
    sc.onerror = _ => {
        document.head.removeChild(sc);
        const _404 = document.createElement("script");
        // @ts-ignore
        _404.src = getMapUrl(window.__PAGES__._404); //make preloaded js to execute
        _404.onload = loadChunks;
        document.head.appendChild(_404);
    };
    // @ts-ignore
    window.__PATH__ = url;
    window.history.pushState('', '', url);
}
exports.loadPage = loadPage;
