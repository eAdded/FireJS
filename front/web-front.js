import ReactDom from "react-dom";
import React from "react";
const App = import(PAGE_SOURCE);

ReactDom.render(<App/>, document.getElementById("root"));