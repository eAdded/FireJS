import FireJS from "./FireJSX";

export default class {
    private readonly $;
    private readonly app;
    private get;
    private getPage;

    constructor(app: FireJS);

    init(port?: number, addr?: string): Promise<void>;
}
