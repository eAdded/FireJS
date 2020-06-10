declare enum PluginCode {
    GlobalPlugin = 0,
    PagePlugin = 1
}
export default abstract class Plugin {
    readonly version: any;
    readonly plugCode: any;
    protected constructor(version: number, plugCode: PluginCode);
}
export {};
