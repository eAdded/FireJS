import WebpackArchitect from "./WebpackArchitect";
import { $, WebpackConfig, WebpackStat } from "../FireJS";
import Page from "../classes/Page";
export default class {
    private readonly $;
    readonly webpackArchitect: WebpackArchitect;
    isOutputCustom: boolean;
    isInputCustom: boolean;
    constructor(globalData: $, webpackArchitect: any, isOutputCustom: boolean, isInputCustom: boolean);
    buildExternals(): Promise<string[]>;
    buildPage(page: Page, resolve: () => void, reject: (err: any | undefined) => void): void;
    build(config: WebpackConfig, resolve: (stat: any) => void, reject: (err: any) => void): void;
    logStat(stat: WebpackStat): boolean;
}
