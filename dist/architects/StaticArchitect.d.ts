import { PathRelatives } from "../FireJS";
import { ExplicitPages, TemplateTags } from "../mappers/ConfigMapper";
import Page from "../classes/Page";
import GlobalPlugin from "../classes/Plugins/GlobalPlugin";
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
    renderGlobalPlugin(globalPlugin: GlobalPlugin): void;
    render(page: Page, path: string, content: any): string;
    addInnerHTML(template: string, element: string, tag: keyof TemplateTags): string;
}
