const {renderToString} = require("react-dom/server");
const _path = require("path");
//set globals for ssr

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    createStatic(mapComponent, content) {
        global.window = {};
        global.document = {};
        global.__SSR__ = true;
        global.React = require("react");
        mapComponent.template = mapComponent.template.replace(
            this.#$.config.templateTags.static,
            "<div id='root'>".concat(
                renderToString(React.createElement(require(_path.join(this.#$.config.paths.babel, mapComponent.babelChunk)).default, content, undefined))
                , "</div>")
        );
    }

    addChunk(mapComponent, chunk, root) {
        root = root || _path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib)
        const templateTags = this.#$.config.templateTags;
        const href = _path.join(root,chunk);
        if (chunk.endsWith(".js"))
            mapComponent.template = mapComponent.template.replace(templateTags.script, `<script src="/${href}"></script>${templateTags.script}`);
        else if (chunk.endsWith(".css"))
            mapComponent.template = mapComponent.template.replace(templateTags.style, `<link rel="stylesheet" href="/${href}">${templateTags.style}`);
        else
            mapComponent.template = mapComponent.template.replace(templateTags.unknown, `<link href="/${href}">${templateTags.unknown}`);
    }

    finalize(mapComponent) {
        if (!this.#$.config.pro) {//div root added in development mode
            mapComponent.template = mapComponent.template.replace(this.#$.config.templateTags.static, "<div id='root'></div>");
        }

        Object.keys(this.#$.config.templateTags).forEach(tag => {
            mapComponent.template = mapComponent.template.replace(this.#$.config.templateTags[tag], "");
        })
    }
}