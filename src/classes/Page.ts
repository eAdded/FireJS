import Plugin from "./Plugins/PagePlugin";

export default class {
    public chunks: string[] = [];
    public plugin: Plugin;
    private readonly name: string;

    constructor(page: string) {
        this.name = page;
        this.plugin = new Plugin(this.name);
    }

    toString(): string {
        return this.name;
    }
}