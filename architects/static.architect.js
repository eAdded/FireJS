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
                renderToString(React.createElement(require(_path.join(this.#$.config.paths.babel, mapComponent.babelChunk)).default, content, undefined)))
            , "</div>"
        );
    }

    addChunk(mapComponent, chunk) {
        if (chunk.endsWith(".js")) {
            mapComponent.template = mapComponent.template.replace(this.#$.config.templateTags.script, `<script src="${chunk}"></script>${this.#$.config.templateTags.script}`);
        } else if (chunk.endsWith(".css"))
            mapComponent.template = mapComponent.template.replace(this.#$.config.templateTags.style, `<link rel="stylesheet" href="${chunk}">${this.#$.config.templateTags.style}`);
        else {
            this.#$.cli.warn(`Unknown chunk type of ${chunk}. Adding as link.`)
            mapComponent.template = mapComponent.template.replace(this.#$.config.templateTags.script, `<link href="${chunk}">${this.#$.config.templateTags.style}`);
        }
        //  return template.concat(() =>)
    }

    finalize(mapComponent) {
        Object.keys(this.#$.config.templateTags).forEach(tag => {
            mapComponent.template = mapComponent.template.replace(this.#$.config.templateTags[tag], "");
        })
    }

}