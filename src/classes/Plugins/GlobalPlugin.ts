import FireJSPlugin, {PluginCode} from "./FireJSPlugin";

export const GlobalPlugMinVer = 0.2;

export default class extends FireJSPlugin {

    protected constructor() {
        super(0.1, PluginCode.GlobalPlugin);
    }

    initServer(server: Express.Application) {
    }
}