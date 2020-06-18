FireJS.lazyCount = 0;
FireJS.lazyDone = 0;
FireJS.lazyLoad = function (chunkPromise, id, options, children) {
    FireJS.lazyCount++;
    chunkPromise.then(chunk => {
        if (id) {
            (FireJS.isHydrated ? ReactDOM.hydrate : ReactDOM.render)
            (React.createElement(chunk.default, options, children), document.getElementById(id));
        }
        if ((++FireJS.lazyDone === FireJS.lazyCount) && FireJS.isSSR)
            FireJS.finishRender();
    })
}