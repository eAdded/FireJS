const {renderToString} = require("react-dom/server");
global.React = require("react");

module.exports = class {
    static createStatic(page, data, template) {
        return template.replace("<div id='root'></div>",
            "<div id='root'>"
                .concat((() => {
                    const req = require(page).default;
                    console.log(req.constructor.name, req.name, typeof req)
                    return renderToString(React.createElement(req,data,undefined));
                })())
                .concat("</div>"));
    }
}