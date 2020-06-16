"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const jsdom_1 = require("jsdom");
const LinkApi_js_1 = require("../../web/LinkApi.js");
class default_1 {
    constructor(param) {
        this.param = param;
        this.param.template = this.addInnerHTML(this.param.template, `<script>` +
            `window.__LIB_REL__="${this.param.rel.libRel}";` +
            `window.__MAP_REL__="${this.param.rel.mapRel}";` +
            `window.__PAGES__={404:"/${this.param.explicitPages["404"].substring(0, this.param.explicitPages["404"].lastIndexOf("."))}"};` +
            `window.__SSR__=` +
            `${param.ssr ? `window.__HYDRATE__ = true;` : ""}` +
            `</script>`, "head");
        // @ts-ignore
        this.param.template = this.addInnerHTML(this.param.template, `<meta content="@eadded/firejs v${global.__FIREJS_VERSION__}" name="generator"/>`, "head");
        if (param.ssr)
            require(path_1.join(this.param.pathToLib, this.param.externals[0]));
    }
    renderGlobalPlugin(globalPlugin) {
        /*globalPlugin.onRender(callback =>
                this.param.template = callback(this.param.template),
            (chunk, tag, root) =>
                this.param.template = this.addChunk(this.param.template, chunk, root, tag),
            (element, tag) =>
                this.param.template = this.addInnerHTML(this.param.template, element, tag)
        )*/
    }
    renderStatic(page, path, content) {
    }
    render(page, path, content) {
        const dom = new jsdom_1.JSDOM(this.param.template);
        global.window = dom.window;
        global.document = global.window.document;
        global.location = global.window.location;
        //globals
        global.window.__LIB_REL__ = this.param.rel.libRel;
        global.window.__MAP_REL__ = this.param.rel.mapRel;
        global.window.__MAP__ = {
            content,
            chunks: []
        };
        global.window.location.pathname = path;
        //static render
        if ((global.window.__SSR__ = this.param.ssr)) {
            require(path_1.join(this.param.pathToLib, page.chunks[0]));
            document.getElementById("firejs-root").innerHTML = global.window.ReactDOMServer.renderToString(global.window.React.createElement(global.window.__FIREJS_APP__.default, { content: global.window.__MAP__.content }));
        }
        //map
        LinkApi_js_1.loadMap(path);
        //React
        LinkApi_js_1.preloadChunks([this.param.externals[1]]);
        LinkApi_js_1.loadChunks([this.param.externals[1]]);
        //Main Chunk
        LinkApi_js_1.preloadChunks([page.chunks[0]]);
        LinkApi_js_1.loadChunks([page.chunks[0]]);
        //Render Chunk
        LinkApi_js_1.preloadChunks([this.param.externals[2]]);
        LinkApi_js_1.loadChunks([this.param.externals[2]]);
        //add rest of the chunks
        for (let i = 1; i < page.chunks.length; i++) {
            LinkApi_js_1.preloadChunks([page.chunks[i]]);
            LinkApi_js_1.loadChunks([page.chunks[i]]);
        }
        /*page.plugin.onRender(callback =>
                template = callback(template),
            (chunk, tag, root) =>
                template = this.addChunk(template, chunk, root, tag),
            (element, tag) =>
                template = this.addInnerHTML(template, element, tag)
        )*/
        return window.document.documentElement.outerHTML;
    }
    addInnerHTML(template, element, tag) {
        return template.replace(this.param.tags[tag], `${element}${this.param.tags[tag]}`);
    }
}
exports.default = default_1;
