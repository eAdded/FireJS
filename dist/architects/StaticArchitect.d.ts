import { PathRelatives } from "../index";
import { ExplicitPages, TemplateTags } from "../mappers/ConfigMapper";
import Page from "../classes/Page";
export interface StaticConfig {
    rel: PathRelatives;
    tags: TemplateTags;
    externals: string[];
    explicitPages: ExplicitPages;
    babelPath: string;
}
export default class {
    param: StaticConfig;
    constructor(param: StaticConfig);
    render(template: string, page: Page, path: string, content: any): string;
    addChunk(template: string, chunk: string, root?: string | undefined, tag?: string | undefined): string;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): string;
}
