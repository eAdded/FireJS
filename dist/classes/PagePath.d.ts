interface map {
    chunks: string[];
    content: any;
}
export default class {
    private readonly path;
    private readonly map;
    private readonly map_path;
    constructor(mapComponent: any, path: any, content: any, $: any);
    get Map(): map;
    get MapPath(): string;
    get Path(): string;
}
export {};
