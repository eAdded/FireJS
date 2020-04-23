const {renderToString} = require("react-dom/server");
global.React = require("react");

module.exports = class {
    static createStatic(page, data, template) {
        console.log()
        return template.replace("<div id='root'/>",`<div id='root'>${renderToString(require(page).default(data))}</div>`);
    }
}