import reactServer = require("react-dom/server");
import {PathRelatives} from "../FireJS";
import {join} from "path"
import {ExplicitPages, TemplateTags} from "../mappers/ConfigMapper";
import Page from "../classes/Page";
import {Helmet} from "react-helmet"

export interface StaticConfig {
    rel: PathRelatives,
    tags: TemplateTags,
    externals: string[],
    explicitPages: ExplicitPages,
    pathToLib: string,
    template: string,
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
            `</script>`,
            "head");
        // @ts-ignore
        this.param.template = this.addInnerHTML(this.param.template, `<meta content="@eadded/firejs v${global.__FIREJS_VERSION__}" name="generator"/>`, "head")
    }

    renderStatic(page: Page, path: string, content: any) {
        if (content) {
            // @ts-ignore
            global.window.__LIB_REL__ = this.param.rel.libRel;
            // @ts-ignore
            global.window.__LIB_REL__ = this.param.rel.libRel;
            // @ts-ignore
            global.window.__MAP_REL__ = this.param.rel.mapRel;
            // @ts-ignore
            global.window.__MAP__ = {
                content,
                chunks: []
            };
            // @ts-ignore
            global.window.__HYDRATE__ = true;
            // @ts-ignore
            global.location = {
                pathname: path
            };
            // @ts-ignore
            global.document = {};
            require(join(this.param.pathToLib, page.chunks[0]))
            // @ts-ignore
            return reactServer.renderToString(
                // @ts-ignore
                React.createElement(window.__FIREJS_APP__.default, {content: window.__MAP__.content})
            );
        } else
            return ""
    }

    render(template: string, page: Page, path: string, content: any) {
        const staticRender = this.renderStatic(page, path, content);
        //map
        template = this.addChunk(template, join(this.param.rel.mapRel, path + ".map.js"), "", "head");
        if (content) {
            const helmet = Helmet.renderStatic();
            for (let head_element in helmet)
                template = this.addInnerHTML(template, helmet[head_element].toString(), "head");
        }
        //add main entry
        template = this.addChunk(template, page.chunks[0]);
        //externals
        this.param.externals.forEach(external => {
            template = this.addChunk(template, external);//react
        })
        for (let i = 1; i < page.chunks.length; i++)
            template = this.addChunk(template, page.chunks[i]);
        template = template.replace(
            this.param.tags.static,
            `<div id='root'>${staticRender}</div>`);
        return template
    }


    addChunk(template, chunk, root = undefined, tag = undefined) {
        root = root === undefined ? this.param.rel.libRel : root;
        const href = join(root, chunk);
        if (tag === "script" || chunk.endsWith(".js")) {
            template = template.replace(this.param.tags.style, `<link rel = "preload" as = "script"href = "/${href}"crossorigin = "anonymous" >${this.param.tags.style}`);
            return template.replace(this.param.tags.script, ` <script src = "/${href}" crossorigin = "anonymous" > </script>${this.param.tags.script}`);
        } else if (tag === "style" || chunk.endsWith(".css")) {
            template = template.replace(this.param.tags.style, `<link rel="preload" as="script" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
            return template.replace(this.param.tags.style, `<link rel="stylesheet" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
        } else if (tag === "head")
            return template.replace(this.param.tags.head, `<link href="/${href}" crossorigin="anonymous">${this.param.tags.head}`);
        else
            return template.replace(this.param.tags.unknown, `<link href="/${href}" crossorigin="anonymous">${this.param.tags.unknown}`);
    }

    addInnerHTML(template: string, element: string, tag: string) {
        return template.replace(this.param.tags[tag], `${element}${this.param.tags[tag]}`)
    }

    finalize(template: string) {
        Object.keys(this.param.tags).forEach(tag => {
            template = template.replace(this.param.tags[tag], "");
        })
        return template;
    }
}