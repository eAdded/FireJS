import { Config } from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import Page from "./classes/Page";
import { Configuration, Stats } from "webpack";
import PageArchitect from "./architects/PageArchitect";
import StaticArchitect, { StaticConfig } from "./architects/StaticArchitect";
export declare type WebpackConfig = Configuration;
export declare type WebpackStat = Stats;
export interface PathRelatives {
    libRel: string;
    mapRel: string;
}
export interface $ {
    config?: Config;
    pageMap?: Map<string, Page>;
    cli?: Cli;
    rel?: PathRelatives;
    outputFileSystem?: any;
    inputFileSystem?: any;
    renderer?: StaticArchitect;
    pageArchitect?: PageArchitect;
}
export interface Params {
    config?: Config;
    webpackConfig?: WebpackConfig;
    outputFileSystem?: any;
    inputFileSystem?: any;
}
export interface FIREJS_MAP {
    staticConfig: StaticConfig;
    pageMap: {
        [key: string]: string[];
    };
}
export default class {
    private readonly $;
    constructor(params: Params);
    init(): Promise<void>;
    buildPage(page: Page): Promise<void>;
    getContext(): $;
}
