import {WebpackConfig} from "../FireJS";

export enum PluginCode {
    GlobalPlugin = 1,
    PagePlugin
}

export default abstract class FireJSPlugin {
    public readonly version;
    public readonly plugCode;

    protected constructor(version: number, plugCode: PluginCode) {
        this.plugCode = plugCode;
        this.version = version;
    }

    initWebpack(webpackConfig: WebpackConfig) {
    }
}