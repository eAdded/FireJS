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
    readonly rel: PathRelatives;
    readonly rootDir: string;
    constructor(pathToLibDir: string, rootDir?: string);
    loadPagePlugin(pluginPath: string): void;
    cachePluginData(_page: string): Promise<void>;
    renderWithPluginData(__page: string, path: string): Promise<{
        html: string;
        map: string;
    }>;
    render(__page: string, path: string, content?: any): RenderReturn;
}
export {};
