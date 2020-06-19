FireJS.lazyCount = 0;
FireJS.lazyDone = 0;
export default (chunk, {ssr = true, script, delay = 0, placeHolder = <></>} = {}) => {
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
    chunk.then(chunk =>
        setTimeout(() => {
            FireJS.lazyDone++;
            if (!script) {
                const el = React.createElement(chunk.default, props, props.children);
                if (FireJS.isSSR && ssr)
                    document.getElementById(id).outerHTML = window.ReactDOMServer.renderToString(el);
                else
                    setChild(el)
            }
            if (FireJS.lazyDone === FireJS.lazyCount && FireJS.isSSR)
                FireJS.finishRender();
        }, delay)
    )
    if (!script)
        return function (_props) {
            props = _props;
            const [child, _setChild] = React.useState(placeHolder);
            setChild = _setChild;
            return child;
        }
}