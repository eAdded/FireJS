import PagePath from "./PagePath";
import {PageObject} from "../mappers/PluginMapper";
import {ChunkGroup} from "../index";

export default class {
    public paths: PagePath[] = [];
    public chunkGroup: ChunkGroup = {chunks: [], babelChunk: ""}
    public plugin: PageObject[];
    private readonly name: string;

    constructor(page: string) {
        this.name = page;
    }

    get Name(): string {
        return this.name;
    }
}