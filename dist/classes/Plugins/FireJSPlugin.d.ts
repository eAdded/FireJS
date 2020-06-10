export declare enum PluginCode {
    GlobalPlugin = 1,
    PagePlugin = 2
}
export default abstract class FireJSPlugin {
    readonly version: any;
    readonly plugCode: any;
    protected constructor(version: number, plugCode: PluginCode);
}