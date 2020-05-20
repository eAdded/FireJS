import {join, relative} from "path";
import MapComponent from "./MapComponent";
import {$} from "../index";

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

    constructor(mapComponent: MapComponent, path: string, content: any, $: $) {
        this.path = path;
        this.map = {
            chunks: mapComponent.chunkGroup.chunks,
            content
        }
        this.map_path = join(relative($.config.paths.dist, $.config.paths.map), path + ".map.js");
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