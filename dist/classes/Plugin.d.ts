export default class {
    page: string;
    paths: string[];
    constructor(page: string);
    initPaths(): Promise<void>;
    getContent(path: string): Promise<any>;
}
