window.onpopstate = function () {
    window.LinkApi.preloadPage(location.pathname, function () {
        window.LinkApi.loadPage(location.pathname, false)
    })
}

if (window.__HYDRATE__)
    window.LinkApi.runApp(ReactDOM.hydrate)
else
    window.LinkApi.runApp()