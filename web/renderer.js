window.onpopstate = function () {
    FireJS.linkApi.preloadPage(location.pathname, function () {
        FireJS.linkApi.loadPage(location.pathname, false)
    })
}

if (FireJS.isHydrated)
    FireJS.linkApi.runApp(ReactDOM.hydrate)
else
    FireJS.linkApi.runApp()