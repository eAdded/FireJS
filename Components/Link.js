export default ({to, children, className}) => {
    function load() {
        const map_script = document.createElement("script");
        map_script.src = `/${window.__MAP_REL__}${to === "/" ? "/index" : to}.map.js`;//make preloaded js to execute
        console.log(map_script)
        document.head.appendChild(map_script);
        map_script.onload = () => {
            window.__MAP__.chunks.forEach(chunk => {
                const preloadLink = document.createElement("link");
                preloadLink.href = `/${window.__LIB_REL__}/` + chunk;
                preloadLink.rel = "preload";
                preloadLink.as = "script";//this preloads script before hand
                console.log(preloadLink)
                document.head.appendChild(preloadLink);
            })
        };
    }

    function apply() {
        window.__MAP__.chunks.forEach(chunk => {
            const preloadedScript = document.createElement("script");
            preloadedScript.src = `/${window.__LIB_REL__}/` + chunk;//make preloaded js to execute
            console.log(preloadedScript)
            document.head.appendChild(preloadedScript);
        });
    }

    return (
        <a className={className} onClick={apply} onMouseEnter={load}>
            {children}
        </a>
    )
}