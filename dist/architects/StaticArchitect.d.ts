import { PathRelatives } from "../FireJS";
import { ExplicitPages, TemplateTags } from "../mappers/ConfigMapper";
import Page from "../classes/Page";
export interface StaticConfig {
    rel: PathRelatives;
    tags: TemplateTags;
    externals: string[];
    explicitPages: ExplicitPages;
    pathToLib: string;
    template: string;
    static: boolean;
}
export default class {
    param: StaticConfig;
    constructor(param: StaticConfig);
    renderStatic(page: Page, path: string, content: any): any;
    render(template: string, page: Page, path: string, content: any): string;
    addChunk(template: any, chunk: any, root?: any, tag?: any): any;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): string;
}
