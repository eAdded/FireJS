/// <reference types="express-serve-static-core" />
export default class {
    page: string;
    version: number;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void): Promise<void>;
    initServer(server: Express.Application): Promise<void>;
}
