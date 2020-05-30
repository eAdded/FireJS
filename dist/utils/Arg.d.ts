export default class<T> {
    private args;
    _name: string;
    _version: string;
    _description: string;
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
    option(flags: [string, keyof T] | [keyof T], valueType: any, description: string): this;
    parse(options?: any): T;
    smartParse(options?: any): T | never;
    displayHelp(): void;
}
export declare function printHeading(color: number, msg: string): void;
export declare function printChild(color: number, msg: string, value?: string | undefined): void;
