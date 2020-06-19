import { WebpackConfig } from "../FireJS";
import { JSDOM } from "jsdom";
export declare enum PluginCode {
    GlobalPlugin = 1,
    PagePlugin = 2
}
export default abstract class FireJSPlugin {
    readonly version: any;
    readonly plugCode: any;
    protected constructor(version: number, plugCode: PluginCode);
    initWebpack(webpackConfig: WebpackConfig): void;
    onRender(dom: JSDOM): void;
}
