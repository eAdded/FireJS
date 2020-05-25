import { PathRelatives } from "../index";
import Page from "./Page";
export interface PageMap {
    chunks: string[];
    content: any;
}
export default class {
    private readonly path;
    private readonly map_path;
    private readonly map;
    constructor(mapComponent: Page, path: string, content: any, rel: PathRelatives);
    getMap(): PageMap;
    getPathToMap(): string;
    getPath(): string;
}
