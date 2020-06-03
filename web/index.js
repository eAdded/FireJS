import Wrapper from "./Wrapper";
import {loadPage, preloadPage} from "../components/LinkApi";

window.onpopstate = function () {
    preloadPage(location.pathname, () => {
        loadPage(location.pathname, false)
    })
}

if (window.__SSR__)
    ReactDOM.hydrate(<Wrapper/>,
        document.getElementById("root")
    );
else
    ReactDOM.render(<Wrapper/>,
        document.getElementById("root")
    );