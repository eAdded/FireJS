const {renderToString} = require("react-dom/server");
//set globals for ssr
global.window = {};
global.document = {};
global.__SSR__ = true;
global.React = require("react");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    static createStatic(page, data, template) {
        return template.replace("<div id='root'></div>",
            "<div id='root'>"
                .concat((() => {
                    return renderToString(React.createElement(require(page).default, data, undefined));
                })())
                .concat("</div>"));
    }

    addChunk(template, chunk) {
        if (chunk.endsWith(".js")) {
            return template.replace(this.#$.config.templateTags.script,`<script src=${chunk}></script>`)
        }
        return template.concat(() =>)
    }
}