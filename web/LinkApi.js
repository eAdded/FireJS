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
            this.preloadChunks(window.__MAP__.chunks, "prefetch");
            callback();
        };
        map_script.onerror = () => {
            document.head.removeChild(map_script);
            this.loadMap(window.__PAGES__["404"]).onload = map_script.onload;
        };
    },
    loadPage: function (url, pushState = true) {
        window.webpackJsonp_FIREJS_APP_ = undefined
        const script = document.createElement("script");
        script.src = `/${window.__LIB_REL__}/${window.__MAP__.chunks.shift()}`
        this.loadChunks(window.__MAP__.chunks);
        script.onload = () => {
            this.runApp()
        }
        document.body.appendChild(script);
        if (pushState)
            window.history.pushState(undefined, undefined, url);
    },
    runApp: function (func = window.ReactDOM.render) {
        func(window.React.createElement(window.__FIREJS_APP__.default, {content: window.__MAP__.content}),
            document.getElementById("firejs-root")
        );
    },
    preloadChunks: function (chunks, rel = "preload") {
        chunks.forEach(chunk => {
            const ele = document.createElement("link");
            ele.rel = rel;
            ele.href = `/${window.__LIB_REL__}/${chunk}`;
            ele.crossOrigin = "anonymous";
            if (chunk.endsWith(".js"))
                ele.setAttribute("as", "script");
            else if (chunk.endsWith(".css"))
                ele.setAttribute("as", "style");
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
                    ele = document.createElement("link");
                    ele.href = `/${window.__LIB_REL__}/${chunk}`
                    ele.rel = "stylesheet";
                    break;
                default :
                    ele = document.createElement("link");
                    ele.href = `/${window.__LIB_REL__}/${chunk}`
            }
            ele.crossOrigin = "anonymous";
            document.body.appendChild(ele);
        });
    }
}