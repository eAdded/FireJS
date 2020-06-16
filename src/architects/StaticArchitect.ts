import {PathRelatives} from "../FireJS";
import {join} from "path"
import {ExplicitPages, TemplateTags} from "../mappers/ConfigMapper";
import Page from "../classes/Page";
import GlobalPlugin from "../classes/Plugins/GlobalPlugin";
import {JSDOM} from "jsdom"

export interface StaticConfig {
    rel: PathRelatives,
    tags: TemplateTags,
    externals: string[],
    explicitPages: ExplicitPages,
    pathToLib: string,
    template: string,
    ssr: boolean,
}

export default class {
    param: StaticConfig

    constructor(param: StaticConfig) {
        this.param = param;
        this.param.template = this.addInnerHTML(this.param.template,
            `<script>` +
            `window.__LIB_REL__="${this.param.rel.libRel}";` +
            `window.__MAP_REL__="${this.param.rel.mapRel}";` +
            `window.__PAGES__={404:"/${this.param.explicitPages["404"].substring(0, this.param.explicitPages["404"].lastIndexOf("."))}"};` +
            `window.__SSR__=` +
            `${param.ssr ? `window.__HYDRATE__ = true;` : ""}` +
            `</script>`,
            "head");
        // @ts-ignore
        global.window = {};
        require("../../web/LinkApi");
        this.param.template = this.addInnerHTML(this.param.template, `<meta content="@eadded/firejs v${global.__FIREJS_VERSION__}" name="generator"/>`, "head")
        if (param.ssr)
            require(join(this.param.pathToLib, this.param.externals[0]));
    }

    renderGlobalPlugin(globalPlugin: GlobalPlugin) {
        /*globalPlugin.onRender(callback =>
                this.param.template = callback(this.param.template),
            (chunk, tag, root) =>
                this.param.template = this.addChunk(this.param.template, chunk, root, tag),
            (element, tag) =>
                this.param.template = this.addInnerHTML(this.param.template, element, tag)
        )*/
    }

    render(page: Page, path: string, content: any) {
        const dom = new JSDOM(this.param.template);
        dom.window.LinkApi = global.window.LinkApi;
        dom.window.React = global.window.React
        dom.window.ReactDOM = global.window.ReactDOM
        dom.window.ReactDOMServer = global.window.ReactDOMServer
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
            require(join(this.param.pathToLib, page.chunks[0]));
            document.getElementById("firejs-root").innerHTML = global.window.ReactDOMServer.renderToString(
                global.window.React.createElement(
                    global.window.__FIREJS_APP__.default,
                    {content: global.window.__MAP__.content}
                )
            );
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
        return window.document.documentElement.outerHTML;
    }

    addInnerHTML(template: string, element: string, tag: keyof TemplateTags) {
        return template.replace(this.param.tags[tag], `${element}${this.param.tags[tag]}`)
    }
}