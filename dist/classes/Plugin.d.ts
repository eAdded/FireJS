/// <reference types="express-serve-static-core" />
export default class {
    page: string;
    paths: Map<string, undefined>;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void, callback: () => void): void;
    onRequest(req: Express.Request, res: Express.Response): void;
}
