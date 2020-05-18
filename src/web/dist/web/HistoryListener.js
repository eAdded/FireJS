import {loadChunks, preloadPage} from "./LinkApi";

window.onpopstate = () => {
    preloadPage(location.pathname, () => {
        loadChunks();
    });
};
