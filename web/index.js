import {loadPage, preloadPage} from "../components/LinkApi";

window.onpopstate = function () {
    preloadPage(location.pathname, () => {
        loadPage(location.pathname)
    })
}
ReactDOM.hydrate(React.createElement(window.__FIREJS_APP__.default, {content: window.__MAP__.content}),
    document.getElementById("root")
);