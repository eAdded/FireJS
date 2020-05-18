import Cli from "./utils/Cli";
export interface $ {
    args: any;
    config: any;
    map: any;
    externals: string[];
    cli: Cli;
    webpackConfig: any;
    template: string;
}
