import MemoryFileSystem from "memory-fs";

export default class {
    public paths: string[] = [];
    public chunks: string[] = [];
    public babelChunk: string;
    public memoryFileSystem: MemoryFileSystem = {};
    public plugin = undefined;
    private readonly page;
    private readonly name;
    private readonly ext;

    constructor(page: string) {
        this.page = page;
        this.name = page.substring(page.lastIndexOf("/") + 1, page.lastIndexOf("."));
        this.ext = page.substring(page.lastIndexOf("."));
    }

    get Page() {
        return this.page;
    }

    get Ext() {
        return this.ext;
    }

    get Name() {
        return this.name;
    }

}