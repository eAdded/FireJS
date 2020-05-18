import MapComponent from "../classes/MapComponent";
import { $ } from "../index";
export default class {
    private readonly $;
    constructor(globalData: $);
    externals: () => {
        target: string;
        mode: string;
        entry: {
            React: string;
            ReactDOM: string;
            ReactHelmet: string;
        };
        output: {
            path: any;
            filename: string;
            library: string;
        };
    };
    getConfigBase(): {
        entry: {};
        output: {};
        module: {
            rules: any[];
        };
        plugins: any[];
        externals: {};
    };
    readUserConfig(): any;
    babel(mapComponent: MapComponent, user_config?: any): any;
    direct(mapComponent: MapComponent, user_config?: any): any;
}
