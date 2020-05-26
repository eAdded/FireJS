import {loadChunks, preloadPage} from "../components/LinkApi";

window.onpopstate = () => {
    preloadPage(location.pathname, () => {
        loadChunks()
    })
}
console.log(window);
ReactDOM.hydrate(React.createElement(
    window.__FIREJS_APP__.default,
    {content: JSON.parse(JSON.stringify(window.__MAP__.content))}//SIMPLEST WAY TOO DEEP COPY
    ),
    document.getElementById("root")
);