"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinkApi_1 = require("./LinkApi");
window.onpopstate = () => {
    LinkApi_1.preloadPage(location.pathname, () => {
        LinkApi_1.loadChunks();
    });
};
