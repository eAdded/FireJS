import MemoryFileSystem from "memory-fs";
import PagePath from "./Path";
import {PageObject} from "../mappers/PluginMapper";
import {ChunkGroup} from "../index";

export default class {
    public paths: PagePath[] = [];
    public chunkGroup: ChunkGroup = {chunks: [], babelChunk: ""}
    public memoryFileSystem: MemoryFileSystem = {};
    public plugin: PageObject[];
    private readonly page;

    constructor(page: string) {
        this.page = page;
    }

    get Page() {
        return this.page;
    }
}