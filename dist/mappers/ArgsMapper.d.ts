export interface Args {
    "--export"?: boolean;
    "--conf"?: string;
    "--verbose"?: boolean;
    "--plain"?: boolean;
    "--silent"?: boolean;
    "--disable-plugins"?: boolean;
    "--help"?: boolean;
    "--fly"?: boolean;
}
export declare function getArgs(): Args;
