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
    ssr: boolean;
}
export default class {
    param: StaticConfig;
    constructor(param: StaticConfig);
    render(page: Page, path: string, content: any): any;
    addInnerHTML(template: string, element: string, tag: keyof TemplateTags): string;
}
