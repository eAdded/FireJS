import FireJSPlugin, {PluginCode} from "./FireJSPlugin";

export const GlobalPlugMinVer = 0.5;

export default class extends FireJSPlugin {

    protected constructor() {
        super(0.5, PluginCode.GlobalPlugin);
    }

    initServer(server: Express.Application) {
    }
}