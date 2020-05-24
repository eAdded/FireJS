import { Args, Config } from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import { Configuration, Stats } from "webpack";
import StaticArchitect, { StaticConfig } from "./architects/StaticArchitect";
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
    pageMap?: Map<string, Page>;
    cli?: Cli;
    template?: string;
    rel?: PathRelatives;
    outputFileSystem?: any;
    inputFileSystem?: any;
    renderer?: StaticArchitect;
    pageArchitect?: any;
    PageArchitect?: any;
}
export interface Params {
    config?: Config;
    args?: Args;
    pages?: string[];
    template?: string;
    webpackConfig?: WebpackConfig;
    outputFileSystem?: any;
    inputFileSystem?: any;
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
    buildPro(): Promise<any>;
    getContext(): $;
}
