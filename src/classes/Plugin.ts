import Page from "./Page";
import {Request, Response} from "express";

export default class {
    page: Page;
    paths: string[] = []

    constructor(page: string | Page) {
        if (page instanceof Page)
            this.page = page;
        else
            this.page = new Page(page);
    }

    async initPaths(): Promise<void> {
        this.paths = [
            "/" + this.page.toString().substring(0, this.page.toString().lastIndexOf("."))
        ]
    }

    async getContent(path: string): Promise<any> {
        return {}
    }

    async serverRequest(req: Request, res: Response): Promise<void> {
    }
}