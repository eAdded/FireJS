"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const jsdom_1 = require("jsdom");
class default_1 {
    constructor(param) {
        this.config = param;
        //init JSDOM
        this.config.template = new jsdom_1.JSDOM(param.template);
        //init template
        {
            const script = this.config.template.window.document.createElement("script");
            script.innerHTML =
                `window.__LIB_REL__="${this.config.rel.libRel}";` +
                    `window.__MAP_REL__="${this.config.rel.mapRel}";` +
                    `window.__PAGES__={404:"/${this.config.explicitPages["404"].substring(0, this.config.explicitPages["404"].lastIndexOf("."))}"};` +
                    `window.__SSR__=` +
                    `${param.ssr ? `window.__HYDRATE__ = true;` : ""}`;
            this.config.template.window.document.head.appendChild(script);
        }
        {
            const meta = this.config.template.window.document.createElement("meta");
            meta.content = `@eadded/firejs v${global.__FIREJS_VERSION__}`;
            meta.name = "generator";
            this.config.template.window.document.head.appendChild(meta);
        }
        //@ts-ignore
        global.window = {};
        //if ssr then load react,react dom,LinkApi,ReactDOMServer chunks
        if (param.ssr)
            require(path_1.join(this.config.pathToLib, this.config.externals[0]));
        else //just load LinkApi
            require("../../web/LinkApi");
    }
    renderGlobalPlugin(globalPlugin) {
        globalPlugin.onRender(this.config.template);
    }
    render(page, path, content) {
        return new Promise(resolve => {
            //template serialize to prevent overwriting
            const dom = new jsdom_1.JSDOM(this.config.template.serialize(), {
                url: "https://localhost:5000" + path,
            });
            //transfer pointers loaded in constructor
            dom.window.LinkApi = global.window.LinkApi;
            dom.window.React = global.window.React;
            dom.window.ReactDOM = global.window.ReactDOM;
            dom.window.ReactDOMServer = global.window.ReactDOMServer;
            dom.window.FireJS_Require = global.window.FireJS_Require;
            //load stuff from dom.window to global
            for (const domKey of ["document", "window", "location", "React", "ReactDOM", "LinkApi"])
                global[domKey] = dom.window[domKey];
            //globals
            global.window.__LIB_REL__ = this.config.rel.libRel;
            global.window.__MAP_REL__ = this.config.rel.mapRel;
            global.window.__MAP__ = {
                content,
                chunks: []
            };
            //chunks
            {
                //map
                global.window.LinkApi.loadMap(path);
                //React
                global.window.LinkApi.preloadChunks([this.config.externals[1]]);
                global.window.LinkApi.loadChunks([this.config.externals[1]]);
                //Main Chunk
                global.window.LinkApi.preloadChunks([page.chunks[0]]);
                global.window.LinkApi.loadChunks([page.chunks[0]]);
                //Render Chunk
                global.window.LinkApi.preloadChunks([this.config.externals[2]]);
                global.window.LinkApi.loadChunks([this.config.externals[2]]);
                //add rest of the chunks
                for (let i = 1; i < page.chunks.length; i++) {
                    global.window.LinkApi.preloadChunks([page.chunks[i]]);
                    global.window.LinkApi.loadChunks([page.chunks[i]]);
                }
            }
            global.window.finish = () => {
                //call plugin
                page.plugin.onRender(dom);
                //serialize i.e get html
                return resolve(dom.serialize());
            };
            //static render
            if ((global.window.__SSR__ = this.config.ssr)) {
                page.chunks.forEach(chunk => {
                    if (chunk.endsWith(".js"))
                        require(path_1.join(this.config.pathToLib, chunk));
                });
                document.getElementById("firejs-root").innerHTML = global.window.ReactDOMServer.renderToString(global.window.React.createElement(global.window.__FIREJS_APP__.default, { content: global.window.__MAP__.content }));
            }
            else
                global.window.finish();
        });
    }
}
exports.default = default_1;
