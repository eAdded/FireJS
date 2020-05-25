import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import { PathRelatives } from "./index";
interface RenderReturn {
    html: string;
    pageMap: string;
}
export default class {
    readonly map: Map<string, Page>;
    readonly renderer: StaticArchitect;
    readonly template: string;
    readonly rel: PathRelatives;
    constructor(pathToBabelDir: string, pathToPluginsDir?: string | undefined, rootDir?: string);
    renderWithPluginData(__page: string, path: string): Promise<RenderReturn>;
    render(__page: string, path: string, content?: any): RenderReturn;
}
export {};
