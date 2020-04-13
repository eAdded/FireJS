import ReactDom from "react-dom";
import React from "react";

(async () => {
    const App = (await import(/* webpackMode: "eager" */PAGE_SOURCE)).default();
    ReactDom.render(App, document.getElementById("root"));
})();
