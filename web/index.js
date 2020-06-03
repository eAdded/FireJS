window.LinkApi = {
    loadMap: function (url) {
        const map_script = document.createElement("script");
        map_script.src = `/${window.__MAP_REL__}${url === "/" ? "/index" : url}.map.js`;
        document.head.appendChild(map_script);
        return map_script;
    },
    preloadPage: function (url, callback) {
        const map_script = this.loadMap(url);
        map_script.onload = () => {
            this.preloadChunks(window.__MAP__.chunks);
            callback();
        };
        map_script.onerror = () => {
            document.head.removeChild(map_script);
            this.loadMap(window.__PAGES__._404).onload = map_script.onload;
        };
    },
    loadPage: function (url, pushState = true) {
        const script = document.createElement("script");
        script.src = `/${window.__LIB_REL__}/${window.__MAP__.chunks.shift()}`
        this.loadChunks(window.__MAP__.chunks);
        script.onload = this.runApp;
        document.body.appendChild(script);
        if (pushState)
            window.history.pushState(undefined, undefined, url);
    },
    runApp: function (func = ReactDOM.render) {
        func(React.createElement(window.__FIREJS_APP__.default, {content: window.__MAP__.content}),
            document.getElementById("root")
        );
    },
    preloadChunks: function (chunks) {
        chunks.forEach(chunk => {
            const ele = document.createElement("link");
            ele.rel = "preload";
            ele.href = `/${window.__LIB_REL__}/${chunk}`;
            ele.crossOrigin = "anonymous";
            switch (chunk.substring(chunk.lastIndexOf("."))) {
                case ".js":
                    ele.as = "script";
                    break;
                case ".css":
                    ele.as = "style";
            }
            document.head.appendChild(ele);
        })
    },
    loadChunks: function (chunks) {
        chunks.forEach(chunk => {
            let ele;
            switch (chunk.substring(chunk.lastIndexOf("."))) {
                case ".js":
                    ele = document.createElement("script");
                    ele.src = `/${window.__LIB_REL__}/${chunk}`
                    break;
                case ".css":
                    ele = document.createElement("ele");
                    ele.href = `/${window.__LIB_REL__}/${chunk}`
                    ele.rel = "stylesheet";
                    break;
                default :
                    ele = document.createElement("ele");
                    ele.href = `/${window.__LIB_REL__}/${chunk}`
            }
            ele.crossOrigin = "anonymous";
            document.body.appendChild(ele);
        });
    }
}
window.onpopstate = function () {
    LinkApi.preloadPage(location.pathname, function () {
        LinkApi.loadPage(location.pathname, false)
    })
}

if (window.__SSR__)
    LinkApi.runApp(ReactDOM.hydrate)
else
    LinkApi.runApp()