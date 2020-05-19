import { Args, Config } from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import MapComponent from "./classes/MapComponent";
import { Configuration, Stats } from "webpack";
export declare type WebpackConfig = Configuration;
export declare type WebpackStat = Stats;
export interface FireJS_MAP {
    externals: string[];
    pages: {
        [key: string]: {
            babelChunk: string;
            chunks: string[];
        };
    };
}
export interface $ {
    args?: Args;
    config?: Config;
    map?: Map<string, MapComponent>;
    cli?: Cli;
    webpackConfig?: WebpackConfig;
    template?: string;
    externals?: string[];
}
export interface Params {
    userConfig?: Config;
    config?: Config;
    args?: Args;
    pages?: string[];
    webpackConfig?: WebpackConfig;
    template?: string;
}
export default class {
    private readonly $;
    constructor(params?: Params);
    mapPluginsAndBuildExternals(): Promise<unknown>;
    buildPro(callback: any): void;
    generateMap(): FireJS_MAP;
    get Context(): $;
}
