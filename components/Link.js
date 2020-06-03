export default ({to, children, className}) => {
    let wasLoaded = false;

    function preLoad(event, callback) {
        if (wasLoaded)
            return;
        LinkApi.preloadPage(to, callback || function () {
            wasLoaded = true;
        });
    }

    function apply(event) {
        if (!wasLoaded)//there is no muse enter in mobile devices
            preLoad(undefined, () => {
                LinkApi.loadPage(to);
            });
        else
            LinkApi.loadPage(to);
        try {
            event.preventDefault();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        // @ts-ignore
        <a href={to} className={className} onClick={apply.bind(this)} onMouseEnter={preLoad.bind(this)}>
           {children}
        </a>
    )
}