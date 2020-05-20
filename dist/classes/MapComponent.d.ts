import MemoryFileSystem from "memory-fs";
import PagePath from "./PagePath";
import { PageObject } from "../mappers/PluginMapper";
import { ChunkGroup } from "../index";
export default class {
    paths: PagePath[];
    chunkGroup: ChunkGroup;
    memoryFileSystem: MemoryFileSystem;
    plugin: PageObject[];
    private readonly page;
    private readonly name;
    private readonly ext;
    constructor(page: string);
    get Page(): any;
    get Ext(): any;
    get Name(): any;
}
