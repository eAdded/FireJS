import Page from "./Page";
import { Request, Response } from "express";
export default class {
    page: Page;
    paths: string[];
    constructor(page: string | Page);
    initPaths(): Promise<void>;
    getContent(path: string): Promise<any>;
    serverRequest(req: Request, res: Response): Promise<void>;
}
