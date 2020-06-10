export enum PluginCode {
    GlobalPlugin,
    PagePlugin
}

export default abstract class FireJSPlugin {
    public readonly version;
    public readonly plugCode;

    protected constructor(version: number, plugCode: PluginCode) {
        this.plugCode = plugCode;
        this.version = version;
    }
}