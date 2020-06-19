export {COUNT, flag} from "./Arg";
export interface Options {
    argv?: string[];
    permissive?: boolean;
    stopAtPositional?: boolean;
}
export default class<T> {
    _name: string;
    _version: string;
    _description: string;
    private args;
    private _usage;
    private _examples;
    private _primary;
    private _secondary;
    name(name: string): this;
    version(version: string): this;
    description(description: string): this;
    usage(usage: string): this;
    example(example: string, description: string): this;
    primary(color: number): this;
    secondary(color: number): this;
    option(flags: [string, keyof T | "--help" | "--version"] | [keyof T | "--help" | "--version"], valueType: any, description?: string | undefined): this;
    parse(options?: Options): T;
    smartParse(options?: Options): T | never;
    displayHelp(): void;
}
export declare function printHeading(color: number, msg: string): void;
export declare function printChild(color: number, msg: string, value?: string | undefined): void;
