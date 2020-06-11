import Page from "./classes/Page";
import StaticArchitect from "./architects/StaticArchitect";
import { PathRelatives } from "./FireJS";
export default class {
    readonly map: Map<string, Page>;
    readonly renderer: StaticArchitect;
    readonly rel: PathRelatives;
    readonly rootDir: string;
    constructor(pathToLibDir: string, rootDir?: string);
    loadPagePlugin(pluginPath: string): void;
    render(__page: string, path: string, content?: any): {
        html: string;
        map: string;
    };
}
