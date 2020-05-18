"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./HistoryListener");
// @ts-ignore
ReactDOM.hydrate(React.createElement(
// @ts-ignore
App.default, 
// @ts-ignore
{ content: JSON.parse(JSON.stringify(window.__MAP__.content)) } //SIMPLEST WAY TOO DEEP COPY
), document.getElementById("root"));
