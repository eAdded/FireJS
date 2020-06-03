require("../components/LinkApi");
window.onpopstate = function () {
    LinkApi.preloadPage(location.pathname, function () {
        LinkApi.loadPage(location.pathname, false)
    })
}

if (window.__SSR__)
    LinkApi.runApp(ReactDOM.hydrate)
else
    LinkApi.runApp()