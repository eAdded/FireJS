import Plugin from "./Plugins/PagePlugin";
export default class {
    chunks: string[];
    plugin: Plugin;
    private readonly name;
    constructor(page: string);
    toString(): string;
}
