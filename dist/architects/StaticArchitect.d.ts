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
}
export default class {
    param: StaticConfig;
    constructor(param: StaticConfig);
    render(template: string, page: Page, path: string, content: any): string;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): string;
}
