window.React = require("react");
window.ReactDOM = require("react-dom")
window.LinkApi = require("./LinkApi").default;

window.onpopstate = function () {
    window.LinkApi.preloadPage(location.pathname, function () {
        window.LinkApi.loadPage(location.pathname, false)
    })
}
if(!window.__SSR__) {
    if (window.__HYDRATE__)
        window.LinkApi.runApp(ReactDOM.hydrate)
    else
        window.LinkApi.runApp()
}