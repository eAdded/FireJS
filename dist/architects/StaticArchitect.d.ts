import { PathRelatives } from "../FireJS";
import { ExplicitPages } from "../mappers/ConfigMapper";
import Page from "../classes/Page";
import { JSDOM } from "jsdom";
import GlobalPlugin from "../Plugins/GlobalPlugin";
export interface StaticConfig {
    rel: PathRelatives;
    externals: string[];
    explicitPages: ExplicitPages;
    pathToLib: string;
    template: string | any;
    ssr: boolean;
}
export interface StaticData extends StaticConfig {
    template: JSDOM;
}
export default class {
    config: StaticData;
    constructor(param: StaticConfig);
    renderGlobalPlugin(globalPlugin: GlobalPlugin): void;
    render(page: Page, path: string, content: any): Promise<string>;
}
