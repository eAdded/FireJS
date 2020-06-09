import Plugin from "./Plugin";
export default class extends Plugin {
    page: string;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void): Promise<void>;
}
