FireJS.lazyCount = 0;
FireJS.lazyDone = 0;
export default (chunk, {ssr = true, script, delay = 0, placeHolder = ""} = {}) => {
    FireJS.lazyCount++;
    if (script && ssr)
        throw new Error("Scripts can't be rendered. Set either script or ssr to false");
    if (FireJS.isSSR)
        delay = 0;
    const id = `FireJS_LAZY_${FireJS.lazyCount}`;
    let compProps = {};
    chunk.then(chunk =>
        setTimeout(() => {
            FireJS.lazyDone++;
            if (!script) {
                let func;
                if (FireJS.isSSR)
                    if (ssr)
                        func = ReactDOM.render;
                    else
                        return;
                else
                    func = FireJS.isHydrated ? ReactDOM.hydrate : ReactDOM.render;
                func(React.createElement(chunk.default, compProps, compProps.children), document.getElementById(id))
            }
            if (FireJS.lazyDone === FireJS.lazyCount && FireJS.isSSR)
                FireJS.finishRender();
        }, delay)
    )
    if (!script)
        return function (props) {
            compProps = props;
            return (
                <div id={id}>
                    {placeHolder}
                </div>
            )
        }
}