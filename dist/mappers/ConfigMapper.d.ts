import { $ } from "../index";
export default class {
    $: $;
    constructor(globalData: $);
    static getArgs: () => any;
    getUserConfig(): any;
    getConfig(userConfig?: any): any;
    private makeAbsolute;
    private throwIfNotFound;
    private undefinedIfNotFound;
    private getPlugins;
    private pluginExists;
    private makeDirIfNotFound;
}
