export interface Args {
    "--webpack-conf"?: string;
    "--version"?: boolean;
    "--help"?: boolean;
    "--pro"?: boolean;
    "--export"?: boolean;
    "--export-fly"?: boolean;
    "--disk"?: boolean;
    "--conf"?: string;
    "--verbose"?: boolean;
    "--plain"?: boolean;
    "--silent"?: boolean;
    "--disable-plugins"?: boolean;
    "--root"?: string;
    "--src"?: string;
    "--pages"?: string;
    "--out"?: string;
    "--dist"?: string;
    "--cache"?: string;
    "--fly"?: string;
    "--template"?: string;
    "--lib"?: string;
    "--map"?: string;
    "--static"?: string;
    "--plugins"?: string;
}
export declare function getArgs(): Args;
