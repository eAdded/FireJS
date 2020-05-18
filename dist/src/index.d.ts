import Cli from "./utils/Cli";
export interface $ {
    args?: any;
    config?: any;
    map?: any;
    cli?: Cli;
    webpackConfig?: any;
    template?: string;
    externals?: string[];
}
export interface params {
    userConfig?: any;
    config?: any;
    args?: any;
    map?: any;
    webpackConfig?: any;
    template?: string;
}
export default class {
    private readonly $;
    constructor(params?: params);
    mapPluginsAndBuildExternals(): Promise<unknown>;
    buildPro(callback: any): void;
    getContext(): $;
}
