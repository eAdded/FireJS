import Wrapper from "./Wrapper";
import {loadPage, preloadPage} from "../components/LinkApi";

window.onpopstate = function () {
    preloadPage(location.pathname, () => {
        loadPage(location.pathname)
    })
}
ReactDOM.hydrate(<Wrapper content={window.__MAP__.content}/>,
    document.getElementById("root")
);