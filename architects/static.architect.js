const {renderToString} = require("react-dom/server");
if (!global.React)
    global.React = require("react");

module.exports = class {
    static createStatic(page, data, template) {
        return template.replace("<div id='root'></div>",
            "<div id='root'>"
                .concat((() => {
                    return renderToString(React.createElement(require(page).default, data, undefined));
                })())
                .concat("</div>"));
    }
}