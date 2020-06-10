import PagePlugin from "./Plugins/PagePlugin";
export default class {
    chunks: string[];
    plugin: PagePlugin;
    private readonly name;
    constructor(page: string);
    toString(): string;
}
