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
    babelPath: string,
}

export default class {
    param: StaticConfig

    constructor(param: StaticConfig) {
        this.param = param;
    }

    render(template: string, page: Page, path: string, content: any) {
        //set globals
        template = this.addInnerHTML(template,
            `<script>` +
            `window.__PATH__="${path}";` +
            `window.__LIB_REL__="${this.param.rel.libRel}";` +
            `window.__MAP_REL__="${this.param.rel.mapRel}";` +
            `window.__PAGES__={};` +
            `window.__PAGES__._404="/${this.param.explicitPages["404"].substring(0, this.param.explicitPages["404"].lastIndexOf("."))}";` +
            `</script>`,
            "head");
        //add map script
        template = this.addChunk(template, join(this.param.rel.mapRel, path + ".map.js"), "", "head");
        //add externals
        this.param.externals.forEach(external => {//externals are same for all paths
            template = this.addChunk(template, external);
        });
        //add main entry
        page.chunkGroup.chunks.forEach(chunk => {
            template = this.addChunk(template, chunk);
        });
        template = template.replace(
            this.param.tags.static,
            "<div id='root'>".concat((() => {
                    if (content) {
                        // @ts-ignore
                        global.window = {
                            __LIB_REL__: this.param.rel.libRel,
                            __MAP__: {
                                content,
                                chunks: page.chunkGroup.chunks
                            },
                            __PATH__: path,
                            __MAP_REL__: this.param.rel.mapRel,
                            SSR: true
                        };
                        // @ts-ignore
                        global.document = {};
                        // @ts-ignore
                        global.React = require("react");
                        // @ts-ignore
                        global.ReactDOM = require("react-dom");
                        // @ts-ignore
                        global.ReactHelmet = {Helmet};
                        return renderToString(
                            // @ts-ignore
                            React.createElement(
                                require(join(this.param.babelPath, page.chunkGroup.babelChunk)).default,
                                // @ts-ignore
                                {content: window.__MAP__.content},
                                undefined)
                        );
                    } else
                        return ""
                })(),
                "</div>"
            ));
        if (content) {
            const helmet = Helmet.renderStatic();
            for (let head_element in helmet)
                template = this.addInnerHTML(template, helmet[head_element].toString(), "head");
        }
        return template
    }

    addChunk(template: string, chunk: string, root: string | undefined = undefined, tag: string | undefined = undefined) {
        root = root === undefined ? this.param.rel.libRel : root;
        const href = join(root, chunk);
        if (tag === "script" || chunk.endsWith(".js")) {
            template = template.replace(this.param.tags.style, `<link rel="preload" as="script" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
            return template.replace(this.param.tags.script, `<script src="/${href}"></script>${this.param.tags.script}`);
        } else if (tag === "style" || chunk.endsWith(".css"))
            return template.replace(this.param.tags.style, `<link rel="stylesheet" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
        else if (tag === "head")
            return template.replace(this.param.tags.head, `<link href="/${href}" crossorigin="anonymous">${this.param.tags.head}`);
        else
            return template.replace(this.param.tags.unknown, `<link href="/${href}">${this.param.tags.unknown}`);
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