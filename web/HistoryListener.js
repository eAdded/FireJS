window.onpopstate = () => {
    const map_script = document.createElement("script");
    map_script.src = `/${window.__MAP_REL__}${location.pathname === "/" ? "/index" : location.pathname}.map.js`;//make preloaded js to execute
    document.head.appendChild(map_script);
    map_script.onload = () => {
        window.__MAP__.chunks.forEach(chunk => {
            const preloadedScript = document.createElement("script");
            preloadedScript.src = `/${window.__LIB_REL__}/` + chunk;//make preloaded js to execute
            document.head.appendChild(preloadedScript);
        });
    }
    map_script.onerror = () => {
        document.head.removeChild(map_script);
        const _404 = document.createElement("script");
        _404.src = `/${window.__MAP_REL__}/${window.__PAGES__._404}.map.js`;//make preloaded js to execute
        _404.onload = onload;
        document.head.appendChild(_404);
    }
}