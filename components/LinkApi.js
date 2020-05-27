export function loadMap(url) {
    const map_script = document.createElement("script");
    map_script.src = `/${window.__MAP_REL__}${url === "/" ? "/index" : url}.map.js`;
    return map_script;
}

export function preloadPage(url, callback) {
    const map_script = loadMap(url);
    map_script.onload = () => {
        window.
        callback();
    };
    map_script.onerror = function () {
        document.head.removeChild(map_script);
        const _404 = loadMap(window.__PAGES__._404);
        _404.onload = map_script.onload;
        document.head.appendChild(_404);
    };
    document.head.appendChild(map_script);
}

export function loadPage(url) {
    const sc = loadMap(url);
    sc.onload = function () {
        window.__MAP__.chunks.forEach(chunk => {
            let ele;
            switch (chunk.substring(chunk.lastIndexOf("."))) {
                case ".js":
                    ele = document.createElement("script");
                    break;
                default:
                    ele = document.createElement("script");
                case ".css":
                    ele.rel = "stylesheet\" type=\"text/css\""
            }
            // @ts-ignore
            preloadedScript.src = `/${window.__LIB_REL__}/` + chunk; //make preloaded js to execute
            document.head.appendChild(preloadedScript);
        });
    }
    sc.onerror = _ => {
        document.head.removeChild(sc);
        const _404 = loadMap(window.__PAGES__._404);
        _404.onload = map_script.onload;
        document.head.appendChild(_404);
    };
    document.head.appendChild(map_script);
}