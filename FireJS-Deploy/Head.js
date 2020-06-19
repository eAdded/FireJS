export default ({children, force}) => {
    const el = document.createElement("div");
    if (FireJS.isSSR || force)
        ReactDOM.render(children, el, () =>
            document.head.innerHTML = `${document.head.innerHTML}${el.innerHTML}`
        );
    return (
        <></>
    )
}