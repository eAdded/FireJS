import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import { PathRelatives } from "./index";
export default class {
    readonly map: Map<string, Page>;
    readonly renderer: StaticArchitect;
    readonly template: string;
    readonly rel: PathRelatives;
    constructor(pathToBabelDir: string, pathToPluginsDir?: string | undefined, customPlugins?: string[], rootDir?: string);
    renderWithPluginData(__page: string, path: string): Promise<string>;
    render(__page: string, path: string, content: any): string;
}
