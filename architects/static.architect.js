const _path = require("path");
const {renderToString} = require("react-dom/server");
const {Helmet} = require("react-helmet")
module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    render(mapComponent, pagePath) {
        let template = this.#$.template;
        const libRel = _path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib);
        const mapRel = _path.relative(this.#$.config.paths.dist, this.#$.config.paths.map);
        //set globals
        template = this.addInnerHTML(template,
            `<script>` +
            `window.__PATH__="${pagePath.getPath()}";` +
            `window.__LIB_REL__="${libRel}";` +
            `window.__MAP_REL__="${mapRel}";` +
            `window.__PAGES__={};` +
            `window.__PAGES__._404="/${this.#$.config.pages._404.substring(0, this.#$.config.pages._404.lastIndexOf("."))}";` +
            `</script>`,
            "head");
        //add map script
        template = this.addChunk(template, pagePath.getMapPath(), "", "head");
        //add externals
        this.#$.externals.forEach(external => {//externals are same for all paths
            template = this.addChunk(template, external);
        });
        //add main entry
        mapComponent.chunks.forEach(chunk => {
            template = this.addChunk(template, chunk);
        });
        template = template.replace(
            this.#$.config.templateTags.static,
            "<div id='root'>".concat((() => {
                    if (this.#$.config.pro) {
                        global.window = {
                            __LIB_REL__: libRel,
                            __MAP__: pagePath.getMap(),
                            __PATH__: pagePath.getPath(),
                            __MAP_REL__: mapRel,
                            SSR: true
                        };
                        global.document = {};
                        global.React = require("react");
                        global.ReactDOM = require("react-dom");
                        global.ReactHelmet = {Helmet};
                        return renderToString(
                            React.createElement(require(_path.join(this.#$.config.paths.babel, mapComponent.babelChunk)).default,
                                {content: window.__MAP__.content},//cheap way of deep copy
                                undefined)
                        );
                    } else
                        return ""
                })(),
                "</div>"
            ));
        if (this.#$.config.pro) {
            const helmet = Helmet.renderStatic();
            for (let head_element in helmet)
                template = this.addInnerHTML(template, helmet[head_element].toString(), "head");
        }
        return template
    }

    addChunk(template, chunk, root, tag) {
        root = root === undefined ? _path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib) : root;
        const templateTags = this.#$.config.templateTags;
        const href = _path.join(root, chunk);
        if (tag === "script" || chunk.endsWith(".js")) {
            template = template.replace(templateTags.style, `<link rel="preload" as="script" href="/${href}" crossorigin="anonymous">${templateTags.style}`);
            return template.replace(templateTags.script, `<script src="/${href}"></script>${templateTags.script}`);
        } else if (tag === "style" || chunk.endsWith(".css"))
            return template.replace(templateTags.style, `<link rel="stylesheet" href="/${href}" crossorigin="anonymous">${templateTags.style}`);
        else if (tag === "head")
            return template.replace(templateTags.head, `<link href="/${href}" crossorigin="anonymous">${templateTags.head}`);
        else
            return template.replace(templateTags.unknown, `<link href="/${href}">${templateTags.unknown}`);
    }

    addInnerHTML(template, element, tag) {
        return template.replace(this.#$.config.templateTags[tag], `${element}${this.#$.config.templateTags[tag]}`)
    }

    finalize(template) {
        Object.keys(this.#$.config.templateTags).forEach(tag => {
            template = template.replace(this.#$.config.templateTags[tag], "");
        })
        return template;
    }
}