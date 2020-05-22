import { PathRelatives } from "../index";
import Page from "./Page";
interface map {
    chunks: string[];
    content: any;
}
export default class {
    private readonly path;
    private readonly map;
    private readonly map_path;
    constructor(mapComponent: Page, path: string, content: any, rel: PathRelatives);
    get Map(): map;
    get MapPath(): string;
    get Path(): string;
}
export {};
