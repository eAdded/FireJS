const {renderToString} = require("react-dom/server");
global.React = require("react");

module.exports = class {
    static createStatic(page, data, template) {
        return template.replace("<div id='root'></div>",`<div id='root'>${renderToString(require(page).default(data))}</div>`);
    }
}