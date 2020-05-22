import {WebpackStat} from "../index";
import Page from "./Page";
import PagePath from "./PagePath";

export default class {
    page: Page;

    constructor(page: string) {
        this.page = new Page(page);
    }

    onPageBuild(stat: WebpackStat, actions) {
    }

    onRender(html: string) {
        return html;
    }

    async getPaths(): Promise<string[]> {
        return [
            "/" + this.page.Name.substring(0, this.page.Name.lastIndexOf("."))
        ]
    }

    async getContent(pagePath: PagePath): Promise<any> {
        return {}
    }
}