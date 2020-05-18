import {Args, Config} from "./mappers/ConfigMapper";
import Cli from "./utils/Cli";
import MapComponent from "./classes/MapComponent";

export interface $ {
    args?: Args;
    config?: Config;
    map?: Map<string, MapComponent>;
    cli?: Cli;
    webpackConfig?: any;
    template?: string;
    externals?: string[];
}
export interface params {
    userConfig?: Config;
    config?: Config;
    args?: Args;
    map?: string[];
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
