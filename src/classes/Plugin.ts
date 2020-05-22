import Page from "./Page";

export default class {
    page: Page;

    constructor(page: string) {
        this.page = new Page(page);
    }

    async getPaths(): Promise<string[]> {
        return [
            "/" + this.page.getName().substring(0, this.page.getName().lastIndexOf("."))
        ]
    }

    async getContent(path: string): Promise<any> {
        return {}
    }
}