import {loadPage, preloadPage} from "../web/LinkApi"

export default ({to, children, className}) => {
    let wasLoaded = false;

    function preLoad(event, callback) {
        if (wasLoaded)
            return;
        preloadPage(to, callback || function () {
        });
        wasLoaded = true;
    }

    function apply(event) {
        event.preventDefault();
        if (!wasLoaded)//there is no muse enter in mobile devices
            preLoad(undefined, loadPage(to))
        else
            loadPage(to);
    }

    return (
        <a href={to} className={className} onClick={apply} onMouseEnter={preLoad}>
            {children}
        </a>
    )
}