"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("react-dom/server");
const react_helmet_1 = require("react-helmet");
const path_1 = require("path");
class DefaultArchitect {
    constructor(param) {
        this.param = param;
    }
    render(chunkGroup, pagePath, render_static = true) {
        let template = this.param.template;
        //set globals
        template = this.addInnerHTML(template, `<script>` +
            `window.__PATH__="${pagePath.Path}";` +
            `window.__LIB_REL__="${this.param.rel.libRel}";` +
            `window.__MAP_REL__="${this.param.rel.mapRel}";` +
            `window.__PAGES__={};` +
            `window.__PAGES__._404="/${this.param.pages._404.substring(0, this.param.pages._404.lastIndexOf("."))}";` +
            `</script>`, "head");
        //add map script
        template = this.addChunk(template, pagePath.MapPath, "", "head");
        //add externals
        this.param.externals.forEach(external => {
            template = this.addChunk(template, external);
        });
        //add main entry
        chunkGroup.chunks.forEach(chunk => {
            template = this.addChunk(template, chunk);
        });
        template = template.replace(this.param.tags.static, "<div id='root'>".concat((() => {
            if (render_static) {
                // @ts-ignore
                global.window = {
                    __LIB_REL__: this.param.rel.libRel,
                    __MAP__: pagePath.Map,
                    __PATH__: pagePath.Path,
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
                global.ReactHelmet = { Helmet: react_helmet_1.Helmet };
                return server_1.renderToString(
                // @ts-ignore
                React.createElement(require(path_1.join(this.param.babelPath, chunkGroup.babelChunk)).default, 
                // @ts-ignore
                { content: window.__MAP__.content }, undefined));
            }
            else
                return "";
        })(), "</div>"));
        if (render_static) {
            const helmet = react_helmet_1.Helmet.renderStatic();
            for (let head_element in helmet)
                template = this.addInnerHTML(template, helmet[head_element].toString(), "head");
        }
        return template;
    }
    addChunk(template, chunk, root = undefined, tag = undefined) {
        root = root === undefined ? this.param.rel.libRel : root;
        const href = path_1.join(root, chunk);
        if (tag === "script" || chunk.endsWith(".js")) {
            template = template.replace(this.param.tags.style, `<link rel="preload" as="script" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
            return template.replace(this.param.tags.script, `<script src="/${href}"></script>${this.param.tags.script}`);
        }
        else if (tag === "style" || chunk.endsWith(".css"))
            return template.replace(this.param.tags.style, `<link rel="stylesheet" href="/${href}" crossorigin="anonymous">${this.param.tags.style}`);
        else if (tag === "head")
            return template.replace(this.param.tags.head, `<link href="/${href}" crossorigin="anonymous">${this.param.tags.head}`);
        else
            return template.replace(this.param.tags.unknown, `<link href="/${href}">${this.param.tags.unknown}`);
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
exports.DefaultArchitect = DefaultArchitect;
class default_1 extends DefaultArchitect {
    constructor($) {
        super({
            rel: $.rel,
            tags: $.config.templateTags,
            externals: $.externals,
            pages: $.config.pages,
            babelPath: $.config.paths.babel,
            template: $.template
        });
    }
}
exports.default = default_1;
