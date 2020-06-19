export interface Config {
    pro?: boolean;
    verbose?: boolean;
    logMode?: "plain" | "silent";
    disablePlugins?: boolean;
    ssr?: boolean;
    paths?: {
        root?: string;
        src?: string;
        pages?: string;
        out?: string;
        dist?: string;
        cache?: string;
        fly?: string;
        lib?: string;
        map?: string;
        static?: string;
    };
    plugins?: [];
    pages?: ExplicitPages;
}
export interface ExplicitPages {
    "404"?: string;
}
export default class {
    inputFileSystem: any;
    outputFileSystem: any;
    constructor(inputFileSystem?: any, outputFileSystem?: any);
    getUserConfig(path: string): Config | undefined | never;
    getConfig(config?: Config): Config;
    private makeAbsolute;
    private throwIfNotFound;
    private undefinedIfNotFound;
    private makeDirIfNotFound;
}
