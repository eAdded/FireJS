import MemoryFileSystem from "memory-fs";
import PagePath from "./PagePath";

interface Plugin {
    [k: string]: {
        name: string;
    };
}
export default class {
    paths: PagePath[];
    chunks: string[];
    babelChunk: string;
    memoryFileSystem: MemoryFileSystem;
    plugin: Plugin | undefined;
    private readonly page;
    private readonly name;
    private readonly ext;
    constructor(page: string);
    get Page(): any;
    get Ext(): any;
    get Name(): any;
}
export {};
