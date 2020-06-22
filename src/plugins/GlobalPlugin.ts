import FireJSPlugin, {PluginCode} from "./FireJSPlugin";
import {JSDOM} from "jsdom";

export const GlobalPlugMinVer = 1.0;

export default class extends FireJSPlugin {

    protected constructor() {
        super(1.0, PluginCode.GlobalPlugin);
    }

    initServer(server: Express.Application) {
    }

    initDom(dom: JSDOM) {
    }
}