import Page from "./Page";

export default class {
    page: Page;

    constructor(page: string) {
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