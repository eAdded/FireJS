import { $ } from "../index";
export default class {
    private readonly $;
    constructor(globalData: $);
    buildExternals(): Promise<unknown>;
    buildBabel(mapComponent: any, resolve: any, reject: any): void;
    buildDirect(mapComponent: any, resolve: any, reject: any): void;
    build(config: any, fileSystem: any, resolve: any, reject: any): void;
    logStat(stat: any): boolean;
}
