/// <reference types="express-serve-static-core" />
export default class {
    page: string;
    version: string;
    paths: Map<string, undefined>;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void): Promise<void>;
    initServer(server: Express.Application): Promise<void>;
}
