import Page from "./Page";
export default class {
    page: Page;
    constructor(page: string | Page);
    getPaths(): Promise<string[]>;
    getContent(path: string): Promise<any>;
}
