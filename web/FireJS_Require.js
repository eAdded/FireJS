(() => {
    let count = 0;
    let done = 0;
    window.FireJS_Require = function (chunkPromise, id, options, children) {
        count++;
        chunkPromise.then(chunk => {
            (window.__HYDRATE__ ? ReactDOM.hydrate : ReactDOM.render)
            (React.createElement(chunk.default, options, children), document.getElementById(id));
            if (window.__SSR__ && ++done === count)
                window.finish();
        })
    }
})()
