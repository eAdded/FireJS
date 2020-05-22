import PagePath from "./PagePath";
import {ChunkGroup} from "../index";
import Plugin from "./Plugin";

export default class {
    public paths: PagePath[] = [];
    public chunkGroup: ChunkGroup = {chunks: [], babelChunk: ""}
    public plugin: Plugin;
    private readonly name: string;

    constructor(page: string) {
        this.name = page;
    }

    getName(): string {
        return this.name;
    }
}