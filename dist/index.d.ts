import { Args, Config } from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import MapComponent from "./classes/MapComponent";
import { Configuration, Stats } from "webpack";
import { DefaultArchitect, StaticConfig } from "./architects/StaticArchitect";
export declare type WebpackConfig = Configuration;
export declare type WebpackStat = Stats;
export interface PathRelatives {
    libRel: string;
    mapRel: string;
}
export interface ChunkGroup {
    babelChunk: string;
    chunks: string[];
}
export interface $ {
    args?: Args;
    config?: Config;
    map?: Map<string, MapComponent>;
    cli?: Cli;
    webpackConfig?: WebpackConfig;
    template?: string;
    externals?: string[];
    rel?: PathRelatives;
}
export interface Params {
    config?: Config;
    args?: Args;
    pages?: string[];
    webpackConfig?: WebpackConfig;
    template?: string;
}
export interface FIREJS_MAP {
    staticConfig: StaticConfig;
    pageMap: {
        [key: string]: ChunkGroup;
    };
    template: string;
}
export default class {
    private readonly $;
    constructor(params?: Params);
    mapPluginsAndBuildExternals(): Promise<unknown>;
    buildPro(callback: any): void;
    get Context(): $;
}
export declare class CustomRenderer {
    readonly map: Map<string, MapComponent>;
    readonly architect: DefaultArchitect;
    constructor(pathToBabelDir: string, pathToPluginsDir?: string | undefined, customPlugins?: string[], rootDir?: string);
    renderWithPluginData(): void;
    render(page: any, path: any, content: any): void;
}
