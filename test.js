/*const {config} =require("./config/global.config");
console.log(config);*/
/*const {pageArchitect} = require("./index");
pageArchitect()*/
/*const mapper = require("./mappers/path.mapper");
console.log(mapper.map);
console.log(mapper.pages);*/
//require("./architects/plugin.architect")
/*
const indexPage = require("./dist/index.0f1704b357e5e167e785");
console.log((indexPage))
*/
/*const {renderToString} = require("react-dom/server");
global.React = require("react");
const App = require("./out/.cache/index.a51c2eae9d502d912e5e");
console.log(renderToString(React.createElement(App.default,{},null)));*/
/*const index = require("./dist/index.59d6aff984e7b73585d6");
index.default();*/
const rsg = require("./index");
rsg.init({}).pageArchitect();