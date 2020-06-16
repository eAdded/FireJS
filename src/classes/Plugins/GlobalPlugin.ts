import FireJSPlugin, {PluginCode} from "./FireJSPlugin";

export const GlobalPlugMinVer = 0.1;

export default class extends FireJSPlugin {

    protected constructor() {
        super(0.2, PluginCode.GlobalPlugin);
    }

    initServer(server: Express.Application) {
    }
}