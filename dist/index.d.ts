import Cli from "./utils/Cli";
import MapComponent from "./classes/MapComponent";

export interface $ {
    args?: any;
    config?: any;
    map?: Map<string, MapComponent>;
    cli?: Cli;
    webpackConfig?: any;
    template?: string;
    externals?: string[];
}

export interface params {
    userConfig?: any;
    config?: any;
    args?: any;
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
