export function loadMap(url) {
    const map_script = document.createElement("script");
    map_script.src = getMapUrl(url);
    document.head.appendChild(map_script);
    return map_script;
}

export function preloadPage(url, callback) {
    const map_script = loadMap(url);
    map_script.onload = () => {
        preloadChunks();
        callback();
    };
    map_script.onerror = _ => {
        document.head.removeChild(map_script);
        const _404 = document.createElement("script");
        _404.src = getMapUrl(window.__PAGES__._404);//make preloaded js to execute
        _404.onload = map_script.onload;
        document.head.appendChild(_404);
    };
}

export function getMapUrl(url) {
    return `/${window.__MAP_REL__}${url === "/" ? "/index" : url}.map.js`;
}

export function preloadChunks() {
    window.__MAP__.chunks.forEach(chunk => {
        const preloadLink = document.createElement("link");
        preloadLink.href = `/${window.__LIB_REL__}/` + chunk;
        preloadLink.rel = "preload";
        if (chunk.endsWith(".js"))
            preloadLink.as = "script";//this preloads script before hand
        else
            preloadLink.as = "style"
        document.head.appendChild(preloadLink);
    })
}

export function loadChunks() {
    window.__MAP__.chunks.forEach((chunk, index) => {
        const preloadedScript = chunk.endsWith document.createElement("script");
        preloadedScript.src = `/${window.__LIB_REL__}/` + chunk;//make preloaded js to execute
        if (index == 0) {
            preloadedScript.onload = () => {
                ReactDOM.hydrate(React.createElement(
                    window.__FIREJS_APP__.default,
                    {content: JSON.parse(JSON.stringify(window.__MAP__.content))}//SIMPLEST WAY TOO DEEP COPY
                    ),
                    document.getElementById("root")
                );
            }
        }
        document.head.appendChild(preloadedScript);
    });
}

export function loadPage(url) {
    const sc = loadMap(url);
    sc.onload = () => {
        loadChunks();
    }
    sc.onerror = _ => {
        document.head.removeChild(sc);
        loadMap(window.__PAGES__._404).onload = loadChunks;
    };
    window.__PATH__ = url;
    window.history.pushState('', '', url);
}