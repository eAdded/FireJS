import {loadChunks, preloadPage} from "../components/LinkApi";
import Wrapper from "./dist/wrapper.bundle";

window.onpopstate = () => {
    preloadPage(location.pathname, () => {
        loadChunks()
    })
}

ReactDOM.hydrate(React.createElement(Wrapper),
    document.getElementById("root")
);