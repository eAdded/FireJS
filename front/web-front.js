import ReactDom from "react-dom";
import React from "react";

(async () => {
    console.log(PAGE_SOURCE);
    const App = (await import(/* webpackMode: "eager" */PAGE_SOURCE)).default();
    ReactDom.render(App, document.getElementById("root"));
})();
