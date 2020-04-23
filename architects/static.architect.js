const {renderToString} = require("react-dom/server");
global.React = require("react");

module.exports = class {
    static createStatic(page, data, template) {
        console.log()
        return template.replace("<div id='root'/>", renderToString(global.React.createElement(require(page).default), data, null));
    }
}