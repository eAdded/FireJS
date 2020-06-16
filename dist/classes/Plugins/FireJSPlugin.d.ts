import { WebpackConfig } from "../../FireJS";
import { TemplateTags } from "../../mappers/ConfigMapper";
export declare enum PluginCode {
    GlobalPlugin = 1,
    PagePlugin = 2
}
export default abstract class FireJSPlugin {
    readonly version: any;
    readonly plugCode: any;
    protected constructor(version: number, plugCode: PluginCode);
    initWebpack(webpackConfig: WebpackConfig): void;
    onRender(setTemplate: (callback: (template: string) => string) => void, addChunk: (chunk: string, tag: keyof TemplateTags, root?: string) => void, addInnerHtml: (element: string, tag: keyof TemplateTags) => void): void;
}
