export interface Config {
    pro?: boolean;
    paths?: {
        root?: string;
        src?: string;
        pages?: string;
        out?: string;
        dist?: string;
        babel?: string;
        template?: string;
        lib?: string;
        map?: string;
        webpack?: string;
        static?: string;
        plugins?: string;
    };
    plugins?: string[];
    templateTags?: TemplateTags;
    pages?: ExplicitPages;
}
export interface Args {
    "--pro"?: boolean;
    "--conf"?: string;
    "--verbose"?: boolean;
    "--plain"?: boolean;
    "--silent"?: boolean;
    "--disable-plugins"?: boolean;
}
export interface ExplicitPages {
    "404"?: string;
}
export interface TemplateTags {
    script?: string;
    static?: string;
    head?: string;
    style?: string;
    unknown?: string;
}
export declare function getArgs(): Args;
export default class {
    private readonly cli;
    private readonly args;
    constructor(cli: any, args: any);
    getUserConfig(): any;
    getConfig(userConfig: Config): Config;
    private makeAbsolute;
    private throwIfNotFound;
    private undefinedIfNotFound;
    private makeDirIfNotFound;
}
