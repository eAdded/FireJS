export function loadMap(url) {
    const map_script = document.createElement("script");
    map_script.src = `/${window.__MAP_REL__}${url === "/" ? "/index" : url}.map.js`;
    document.head.appendChild(map_script);
    return map_script;
}

export function preloadPage(url, callback) {
    const map_script = loadMap(url);
    map_script.onload = function () {
        window.updatePreChunks()
        callback();
    };
    map_script.onerror = function () {
        document.head.removeChild(map_script);
        loadMap(window.__PAGES__._404).onload = map_script.onload;
    };
}

export function loadPage(url, pushState = true) {
    const sc = loadMap(url);
    sc.onload = function () {
        const script = document.createElement("script");
        script.src = `/${window.__LIB_REL__}/${window.__MAP__.chunks.shift()}`
        window.updateChunks();
        script.onload = window.updateApp;
        document.body.appendChild(script);
    }
    if (pushState)
        window.history.pushState(undefined, undefined, url);
}