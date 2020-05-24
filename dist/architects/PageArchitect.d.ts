import { $, WebpackConfig, WebpackStat } from "../index";
import Page from "../classes/Page";
export default class {
    private readonly $;
    private readonly webpackArchitect;
    constructor(globalData: $, webpackArchitect: any);
    buildExternals(): Promise<string[]>;
    buildBabel(page: Page, resolve: () => void, reject: (err: any | undefined) => void): void;
    buildDirect(page: Page, resolve: () => void, reject: (err: any | undefined) => void): void;
    build(config: WebpackConfig, resolve: (stat: any) => void, reject: (err: any) => void): void;
    logStat(stat: WebpackStat): boolean;
}
