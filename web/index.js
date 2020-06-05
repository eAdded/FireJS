require("./LinkApi");
window.React = require("react");
window.ReactDOM = require("react-dom")

window.onpopstate = function () {
    LinkApi.preloadPage(location.pathname, function () {
        LinkApi.loadPage(location.pathname, false)
    })
}

if (window.__HYDRATE__)
    LinkApi.runApp(ReactDOM.hydrate)
else
    LinkApi.runApp()