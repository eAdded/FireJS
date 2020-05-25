import {Request, Response} from "express";

export default class {
    page: string;
    paths: string[] = []

    constructor(page: string) {
        this.page = page;
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