const {renderToString} = require("react-dom/server");
const _path = require("path");
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

    createStatic(mapComponent, content) {
        mapComponent.template = mapComponent.template.replace(
            this.#$.config.templateTags.static,
            "<div id='root'>".concat(
                renderToString(React.createElement(require(_path.join(this.#$.paths.babel, mapComponent.babel)).default, content, undefined)))
            , "</div>"
        );
    }

    addChunk(mapComponent, chunk) {
        if (chunk.endsWith(".js")) {
            mapComponent.template.replace(this.#$.config.templateTags.script, `<script src=${chunk}></script>`)
        }
        //  return template.concat(() =>)
    }
}