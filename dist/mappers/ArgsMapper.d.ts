export interface Args {
    "--webpack-conf"?: string;
    "--export"?: boolean;
    "--export-fly"?: string;
    "--disk"?: boolean;
    "--conf"?: string;
    "--verbose"?: boolean;
    "--plain"?: boolean;
    "--silent"?: boolean;
    "--disable-plugins"?: boolean;
    "--help"?: boolean;
    "--fly"?: boolean;
}
export declare function getArgs(): Args;
