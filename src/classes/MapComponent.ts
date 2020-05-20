import MemoryFileSystem from "memory-fs";
import PagePath from "./PagePath";
import {PageObject} from "../mappers/PluginMapper";
import {ChunkGroup} from "../index";

export default class {
    public paths: PagePath[] = [];
    public chunkGroup: ChunkGroup = {chunks: [], babelChunk: ""}
    public memoryFileSystem: MemoryFileSystem = {};
    public plugin: PageObject[];
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