import FireJSPlugin from "./FireJSPlugin";
export declare const PagePlugMinVer = 0.2;
export default abstract class extends FireJSPlugin {
    page: string;
    protected constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void, ...extra: any): Promise<void>;
}
