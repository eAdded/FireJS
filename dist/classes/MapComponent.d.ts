import MemoryFileSystem from "memory-fs";
import PagePath from "./PagePath";
import { PageObject } from "../mappers/PluginMapper";
export default class {
    paths: PagePath[];
    chunks: string[];
    babelChunk: string;
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
