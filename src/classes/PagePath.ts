import {PathRelatives} from "../index";
import {join} from "path";
import Page from "./Page";

interface map {
    chunks: string[],
    content: any
}

export default class {
    private readonly path: string;
    private readonly map: map = {
        chunks: [],
        content: {},
    };
    private readonly map_path: string;

    constructor(mapComponent: Page, path: string, content: any, rel: PathRelatives) {
        this.path = path;
        this.map = {
            chunks: mapComponent.chunkGroup.chunks,
            content
        }
        this.map_path = join(rel.mapRel, path + ".map.js");
    }

    get Map() {
        return this.map;
    }

    get MapPath() {
        return this.map_path;
    }

    get Path() {
        return this.path;
    }
}