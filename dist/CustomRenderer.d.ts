import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import { PathRelatives } from "./FireJS";
interface RenderReturn {
    html: string;
    map: string;
}
export default class {
    readonly map: Map<string, Page>;
    readonly renderer: StaticArchitect;
    readonly template: string;
    readonly rel: PathRelatives;
    constructor(pathToLibDir: string, pathToPluginsDir?: string | undefined, rootDir?: string);
    renderWithPluginData(__page: string, path: string): Promise<RenderReturn>;
    render(__page: string, path: string, content?: any): RenderReturn;
}
export {};
