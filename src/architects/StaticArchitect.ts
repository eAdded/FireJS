import {renderToString} from "react-dom/server"
import {Helmet} from "react-helmet"
import {PathRelatives} from "../FireJS";
import {join} from "path"
import {ExplicitPages, TemplateTags} from "../mappers/ConfigMapper";
import Page from "../classes/Page";

export interface StaticConfig {
    rel: PathRelatives,
    tags: TemplateTags,
    externals: string[],
    explicitPages: ExplicitPages,
    pathToLib: string,
    template: string
}

export default class {
    param: StaticConfig

    constructor(param: StaticConfig) {
        this.param = param;
        // @ts-ignore
        global.React = require("react");
        // @ts-ignore
        global.ReactDOM = require("react-dom");
        // @ts-ignore
        global.ReactHelmet = {Helmet};
        this.param.template = this.addInnerHTML(this.param.template,
            `<script>` +
            `window.__LIB_REL__="${this.param.rel.libRel}";` +
            `window.__MAP_REL__="${this.param.rel.mapRel}";` +
            `window.__PAGES__={};` +
            `window.__PAGES__._404="/${this.param.explicitPages["404"].substring(0, this.param.explicitPages["404"].lastIndexOf("."))}";` +
            `</script>`,
            "head");
    }

    render(template: string, page: Page, path: string, content: any) {
        template = template.replace(
            this.param.tags.static,
            `<div id='root'>${(() => {
                // @ts-ignore
                global.window = {
                    // @ts-ignore
                    __LIB_REL__: this.param.rel.libRel,
                    __MAP_REL__: this.param.rel.mapRel,
                    __MAP__: {
                        content,
                        chunks: page.chunks
                    },
                    __EXTERNALS__: this.param.externals,
                    SSR: true
                };
                // @ts-ignore
                global.document = {};
                // @ts-ignore
                require(join(this.param.pathToLib, page.chunks[0]));
                return renderToString(
                    // @ts-ignore
                    React.createElement(window.__FIREJS_APP__.default,
                        // @ts-ignore
                        {content: window.__MAP__.content},
                        undefined)
                )
            })()}</div>`);
        const helmet = Helmet.renderStatic();
        for (let head_element in helmet)
            template = this.addInnerHTML(template, helmet[head_element].toString(), "head");
        return template
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