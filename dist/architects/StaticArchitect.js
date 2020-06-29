"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const jsdom_1 = require("jsdom");
const Require_1 = require("../utils/Require");
const react_helmet_1 = require("react-helmet");
class default_1 {
    constructor(param) {
        this.config = param;
        //init JSDOM
        this.config.template = new jsdom_1.JSDOM(param.template);
        //init template
        {
            const script = this.config.template.window.document.createElement("script");
            script.innerHTML =
                `window.FireJS={` +
                    `libRel:"${this.config.rel.libRel}",` +
                    `mapRel:"${this.config.rel.mapRel}",` +
                    `pages:{404:"/${this.config.explicitPages["404"].substring(0, this.config.explicitPages["404"].lastIndexOf("."))}"}` +
                    `${param.ssr ? `,isHydrated:true` : ""}` +
                    "}";
            this.config.template.window.document.head.appendChild(script);
        }
        {
            const meta = this.config.template.window.document.createElement("meta");
            meta.content = `@eadded/firejs v${global.__FIREJS_VERSION__}`;
            meta.name = "generator";
            this.config.template.window.document.head.appendChild(meta);
        }
        // @ts-ignore
        global.window = {
            FireJS: {
                isSSR: param.ssr,
                libRel: this.config.rel.libRel,
                mapRel: this.config.rel.mapRel
            }
        };
        global.FireJS = global.window.FireJS;
        //if ssr then load react,react dom,LinkApi,ReactDOMServer chunks
        if (param.ssr)
            require(path_1.join(this.config.pathToLib, this.config.externals[0]));
        else //just load LinkApi
            require("../web/LinkApi");
    }
    renderGlobalPlugin(globalPlugin) {
        globalPlugin.initDom(this.config.template);
    }
    render(page, path, content) {
        return new Promise(resolve => {
            //template serialize to prevent overwriting
            const dom = new jsdom_1.JSDOM(this.config.template.serialize(), {
                url: "https://localhost:5000" + path,
            });
            //transfer pointers loaded in constructor
            dom.window.React = global.window.React;
            dom.window.ReactDOM = global.window.ReactDOM;
            dom.window.ReactDOMServer = global.window.ReactDOMServer;
            dom.window.FireJS = global.window.FireJS;
            //load stuff from dom.window to global
            for (const domKey of ["document", "window", "location", "React", "ReactDOM", "FireJS"])
                global[domKey] = dom.window[domKey];
            //globals
            global.FireJS.map = {
                content,
                chunks: page.chunks
            };
            //isSSR
            global.FireJS.isSSR = this.config.ssr;
            //reset lazy count
            global.FireJS.lazyCount = 0;
            global.FireJS.lazyDone = 0;
            //chunks
            {
                let index;
                //css
                for (index = 1; index < page.chunks.length; index++) {
                    if (!page.chunks[index].endsWith(".js")) {
                        const cssLink = document.createElement("link");
                        cssLink.href = `/${this.config.rel.libRel}/${page.chunks[index]}`;
                        cssLink.rel = "stylesheet";
                        cssLink.crossOrigin = "anonymous";
                        document.head.prepend(cssLink);
                    }
                    else
                        break;
                }
                //map preload and load
                {
                    const link = document.createElement("link");
                    const script = document.createElement("script");
                    script.src = link.href = global.FireJS.linkApi.getMapUrl(path);
                    link.rel = "preload";
                    script.crossOrigin = link.crossOrigin = "anonymous";
                    link.setAttribute("as", "script");
                    document.head.appendChild(link);
                    document.body.appendChild(script);
                }
                //React
                global.FireJS.linkApi.preloadChunks([this.config.externals[1]]);
                global.FireJS.linkApi.loadChunks([this.config.externals[1]]);
                //Main Chunk
                global.FireJS.linkApi.preloadChunks([page.chunks[0]]);
                global.FireJS.linkApi.loadChunks([page.chunks[0]]);
                if (this.config.ssr)
                    Require_1.requireUncached(path_1.join(this.config.pathToLib, page.chunks[0]));
                //Render Chunk
                global.FireJS.linkApi.preloadChunks([this.config.externals[2]]);
                global.FireJS.linkApi.loadChunks([this.config.externals[2]]);
                //add rest of the chunks
                for (; index < page.chunks.length; index++) {
                    global.FireJS.linkApi.preloadChunks([page.chunks[index]]);
                    global.FireJS.linkApi.loadChunks([page.chunks[index]]);
                    if (this.config.ssr)
                        Require_1.requireUncached(path_1.join(this.config.pathToLib, page.chunks[index]));
                }
            }
            global.FireJS.finishRender = () => {
                page.plugin.onRender(dom); //call plugin
                resolve(dom.serialize()); //serialize i.e get html
            };
            //static render
            if (this.config.ssr) {
                document.getElementById("root").innerHTML = global.window.ReactDOMServer.renderToString(global.React.createElement(global.FireJS.app, { content: global.FireJS.map.content }));
                const helmet = react_helmet_1.Helmet.renderStatic();
                for (let helmetKey in helmet)
                    document.head.innerHTML += helmet[helmetKey].toString();
                if (global.FireJS.lazyCount === 0)
                    global.FireJS.finishRender();
            }
            else
                global.FireJS.finishRender();
        });
    }
}
exports.default = default_1;
