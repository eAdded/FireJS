export declare enum PluginCode {
    GlobalPlugin = 0,
    PagePlugin = 1
}
export default abstract class FireJSPlugin {
    readonly version: any;
    readonly plugCode: any;
    protected constructor(version: number, plugCode: PluginCode);
}
