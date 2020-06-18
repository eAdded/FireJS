(() => {
    FireJS.lazyCount = 0;
    let done = 0;
    FireJS.lazyLoad = function (chunkPromise, id, options, children) {
        FireJS.lazyCount++;
        chunkPromise.then(chunk => {
            (FireJS.isHydrated ? ReactDOM.hydrate : ReactDOM.render)
            (React.createElement(chunk.default, options, children), document.getElementById(id));
            if (FireJS.isSSR && ++done === FireJS.lazyCount)
                FireJS.finishRender();
        })
    }
})()