export default class {
    page: string;
    paths = new Map<string, undefined>();

    constructor(page: string) {
        this.page = page;
    }

    onBuild(renderPage: (path: string, content: any) => void, callback: () => void) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {})
        callback();
    }

    onRequest(req: Express.Request, res: Express.Response) {
    }
}