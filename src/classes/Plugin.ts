import Page from "./Page";

export default class {
    page: Page;

    constructor(page: string | Page) {
        if (page instanceof Page)
            this.page = page;
        else
            this.page = new Page(page);
    }

    async getPaths(): Promise<string[]> {
        return [
            "/" + this.page.toString().substring(0, this.page.toString().lastIndexOf("."))
        ]
    }

    async getContent(path: string): Promise<any> {
        return {}
    }
}