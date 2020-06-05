"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class default_1 {
    constructor(param) {
        // @ts-ignore
        global.window = global;
        // @ts-ignore
        global.__SSR__ = { __SSR__: param.static };
        this.param = param;
        this.param.template = this.addInnerHTML(this.param.template, `<script>` +
            `window.__LIB_REL__="${this.param.rel.libRel}";` +
            `window.__MAP_REL__="${this.param.rel.mapRel}";` +
            `window.__PAGES__={404:"/${this.param.explicitPages["404"].substring(0, this.param.explicitPages["404"].lastIndexOf("."))}"};` +
            `${param.static ? `window.__HYDRATE__ = true;` : ""}` +
            `</script>`, "head");
        // @ts-ignore
        this.param.template = this.addInnerHTML(this.param.template, `<meta content="@eadded/firejs v${global.__FIREJS_VERSION__}" name="generator"/>`, "head");
        if (param.static)
            require(path_1.join(this.param.pathToLib, this.param.externals[0]));
    }
    renderStatic(page, path, content) {
        // @ts-ignore
        global.__LIB_REL__ = this.param.rel.libRel;
        // @ts-ignore
        global.__MAP_REL__ = this.param.rel.mapRel;
        // @ts-ignore
        global.__MAP__ = {
            content,
            chunks: []
        };
        // @ts-ignore
        global.location = { pathname: path };
        // @ts-ignore
        global.document = {};
        // @ts-ignore
        require(path_1.join(this.param.pathToLib, page.chunks[0]));
        // @ts-ignore
        return ReactDOMServer.renderToString(
        // @ts-ignore
        React.createElement(window.__FIREJS_APP__.default, { content: window.__MAP__.content }));
    }
    render(template, page, path, content) {
        //map
        template = this.addChunk(template, path_1.join(this.param.rel.mapRel, path + ".map.js"), "", "head");
        //static render
        const staticRender = this.param.static ? this.renderStatic(page, path, content) : "";
        if (this.param.static) {
            // @ts-ignore
            if (window.__Helmet__) {
                // @ts-ignore
                const helmet = window.__Helmet__.renderStatic();
                for (let head_element in helmet)
                    template = this.addInnerHTML(template, helmet[head_element].toString(), "head");
            }
        }
        //React
        template = this.addChunk(template, this.param.externals[0]);
        //Main Chunk
        template = this.addChunk(template, page.chunks[0]);
        //Render Chunk
        template = this.addChunk(template, this.param.externals[1]);
        //add rest of the chunks
        for (let i = 1; i < page.chunks.length; i++)
            template = this.addChunk(template, page.chunks[i]);
        //add static render
        template = template.replace(this.param.tags.static, `<div id='root'>${staticRender}</div>`);
        return template;
    }
    addChunk(template, chunk, root = undefined, tag = undefined) {
        root = root === undefined ? this.param.rel.libRel : root;
        const href = path_1.join(root, chunk);
        if (tag === "script" || chunk.endsWith(".js")) {
            template = template.replace(this.param.tags.style, `<link rel = "preload" as = "script"href = "/${href}"crossorigin = "anonymous" >${this.param.tags.style}`);
            return template.replace(this.param.tags.script, ` <script src = "/${href}" crossorigin = "anonymous" > </script>${this.param.tags.script}`);
        }
        else if (tag === "style" || chunk.endsWith(".css")) {
            template = template.replace(this.param.tags.style, `<link rel="preload" as="script" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
            return template.replace(this.param.tags.style, `<link rel="stylesheet" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
        }
        else if (tag === "head")
            return template.replace(this.param.tags.head, `<link href="/${href}" crossorigin="anonymous">${this.param.tags.head}`);
        else
            return template.replace(this.param.tags.unknown, `<link href="/${href}" crossorigin="anonymous">${this.param.tags.unknown}`);
    }
    addInnerHTML(template, element, tag) {
        return template.replace(this.param.tags[tag], `${element}${this.param.tags[tag]}`);
    }
    finalize(template) {
        Object.keys(this.param.tags).forEach(tag => {
            template = template.replace(this.param.tags[tag], "");
        });
        return template;
    }
}
exports.default = default_1;
