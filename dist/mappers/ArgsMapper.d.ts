export interface Args {
    "--pro"?: boolean;
    "--conf"?: string;
    "--verbose"?: boolean;
    "--plain"?: boolean;
    "--silent"?: boolean;
    "--disable-plugins"?: boolean;
    "--help"?: boolean;
}
export declare function getArgs(): Args;
