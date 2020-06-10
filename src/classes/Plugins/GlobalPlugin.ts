import {WebpackConfig} from "../../FireJS";
import FireJSPlugin, {PluginCode} from "./FireJSPlugin";

export const GlobalPlugMinVer = 0.1;

export default class extends FireJSPlugin {

    protected constructor() {
        super(0.1, PluginCode.GlobalPlugin);
    }

    initServer(server: Express.Application) {
    }

    initWebpack(webpackConfig: WebpackConfig) {
    }
}