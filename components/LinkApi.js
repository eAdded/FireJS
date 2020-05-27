export function loadMap(url) {
    const map_script = document.createElement("script");
    map_script.src = `/${window.__MAP_REL__}${url === "/" ? "/index" : url}.map.js`;
    return map_script;
}

export function preloadPage(url, callback) {
    const map_script = loadMap(url);
    map_script.onload = function () {
        window.wrapper_context.setState({pre_chunks: window.__MAP__.chunks})
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
        window.wrapper_context.setState({chunks: window.__MAP__.chunks})
    }
    sc.onerror = _ => {
        document.head.removeChild(sc);
        const _404 = loadMap(window.__PAGES__._404);
        _404.onload = map_script.onload;
        document.head.appendChild(_404);
    };
    document.head.appendChild(sc);
}