import { $ } from "../index";
export interface Config {
    pro?: boolean;
    paths?: {
        root?: string;
        src?: string;
        pages?: string;
        out?: string;
        dist?: string;
        cache?: string;
        babel?: string;
        template?: string;
        lib?: string;
        map?: string;
        webpack?: string;
        static?: string;
        plugins?: string;
    };
    plugins?: string[];
    templateTags?: {
        script?: string;
        static?: string;
        head?: string;
        style?: string;
        unknown?: string;
    };
    pages?: {
        _404?: string;
    };
}
export interface Args {
    "--pro"?: boolean;
    "--conf"?: string;
    "--verbose"?: boolean;
    "--plain"?: boolean;
    "--silent"?: boolean;
    "--disable-plugins"?: boolean;
}
export declare function getArgs(): Args;
export default class {
    $: $;
    constructor(globalData: $);
    getUserConfig(): any;
    getConfig(userConfig?: Config | undefined): Config;
    private makeAbsolute;
    private throwIfNotFound;
    private undefinedIfNotFound;
    private getPlugins;
    private pluginExists;
    private makeDirIfNotFound;
}
