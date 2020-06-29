import FireJSPlugin from "./FireJSPlugin";
import { JSDOM } from "jsdom";
export declare const PagePlugMinVer = 1;
export default abstract class extends FireJSPlugin {
    page: string;
    protected constructor(page: string);
    onBuild(renderPage: (path: string, content?: any, render?: boolean) => void, ...extra: any): void;
    onRender(dom: JSDOM): void;
}
