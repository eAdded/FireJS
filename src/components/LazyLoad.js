FireJS.lazyCount = 0;
FireJS.lazyDone = 0;
export default (chunk, {
    ssr = true, script, delay = 0, placeHolder = <></>, onError = (e) => {
        console.error("Error while lazy loading ");
        throw new Error(e);
    }
} = {}) => {
    FireJS.lazyCount++;
    if (script && ssr)
        throw new Error("Scripts can't be rendered. Set either script or ssr to false");
    let id;
    if (FireJS.isSSR) {
        delay = 0;
        placeHolder = (<div id={id = `FireJS_LAZY_${FireJS.lazyCount}`}/>)
    }
    let props = {};
    let setChild;

    function load(chunk) {
        FireJS.lazyDone++;
        if (!script) {
            if (FireJS.isSSR && ssr) {
                document.getElementById(id).innerHTML = window.ReactDOMServer.renderToString(
                    React.createElement(chunk.default, props, props.children)
                );
            } else
                setChild(React.createElement(chunk.default, props, props.children))
        }
        if (FireJS.lazyDone === FireJS.lazyCount && FireJS.isSSR)
            FireJS.finishRender();
    }

    chunk.then(chunk => {
            if (!delay)
                load(chunk);
            else
                setTimeout(() => load(chunk), delay);
        }
    ).catch(onError)
    if (!script)
        return function (_props) {
            props = _props;
            const [child, _setChild] = React.useState(placeHolder);
            setChild = _setChild;
            return (
                <div suppressHydrationWarning={true}>
                    {child}
                </div>
            );
        }
}