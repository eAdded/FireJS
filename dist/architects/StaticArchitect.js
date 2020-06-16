"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const jsdom_1 = require("jsdom");
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
        global.window = {};
        require("../../web/LinkApi");
        this.param.template = this.addInnerHTML(this.param.template, `<meta content="@eadded/firejs v${global.__FIREJS_VERSION__}" name="generator"/>`, "head");
        if (param.ssr)
            require(path_1.join(this.param.pathToLib, this.param.externals[0]));
    }
    render(page, path, content) {
        const dom = new jsdom_1.JSDOM(this.param.template, {
            url: "https://localhost:5000" + path,
        });
        dom.window.LinkApi = global.window.LinkApi;
        dom.window.React = global.window.React;
        dom.window.ReactDOM = global.window.ReactDOM;
        dom.window.ReactDOMServer = global.window.ReactDOMServer;
        for (const domKey of ["document", "window", "location", "React", "ReactDOM", "LinkApi"])
            global[domKey] = dom.window[domKey];
        //globals
        global.window.__LIB_REL__ = this.param.rel.libRel;
        global.window.__MAP_REL__ = this.param.rel.mapRel;
        global.window.__MAP__ = {
            content,
            chunks: []
        };
        //static render
        if ((global.window.__SSR__ = this.param.ssr)) {
            page.chunks.forEach(chunk => {
                if (chunk.endsWith(".js"))
                    require(path_1.join(this.param.pathToLib, chunk));
            });
            document.getElementById("firejs-root").innerHTML = global.window.ReactDOMServer.renderToString(global.window.React.createElement(global.window.__FIREJS_APP__.default, { content: global.window.__MAP__.content }));
        }
        //map
        global.window.LinkApi.loadMap(path);
        //React
        global.window.LinkApi.preloadChunks([this.param.externals[1]]);
        global.window.LinkApi.loadChunks([this.param.externals[1]]);
        //Main Chunk
        global.window.LinkApi.preloadChunks([page.chunks[0]]);
        global.window.LinkApi.loadChunks([page.chunks[0]]);
        //Render Chunk
        global.window.LinkApi.preloadChunks([this.param.externals[2]]);
        global.window.LinkApi.loadChunks([this.param.externals[2]]);
        //add rest of the chunks
        for (let i = 1; i < page.chunks.length; i++) {
            global.window.LinkApi.preloadChunks([page.chunks[i]]);
            global.window.LinkApi.loadChunks([page.chunks[i]]);
        }
        /*page.plugin.onRender(callback =>
                template = callback(template),
            (chunk, tag, root) =>
                template = this.addChunk(template, chunk, root, tag),
            (element, tag) =>
                template = this.addInnerHTML(template, element, tag)
        )*/
        return dom.serialize();
    }
    addInnerHTML(template, element, tag) {
        return template.replace(this.param.tags[tag], `${element}${this.param.tags[tag]}`);
    }
}
exports.default = default_1;
