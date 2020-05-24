import {ChunkGroup} from "../index";
import Plugin from "./Plugin";

export default class {
    public chunkGroup: ChunkGroup = {chunks: [], babelChunk: ""}
    public plugin: Plugin;
    private readonly name: string;

    constructor(page: string) {
        this.name = page;
    }

    toString(): string {
        return this.name;
    }
}