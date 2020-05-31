/// <reference types="express-serve-static-core" />
export default class {
    page: string;
    version: string;
    paths: Map<string, undefined>;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void, callback: () => void): Promise<void>;
    onRequest(req: Express.Request, res: Express.Response): Promise<void>;
}
