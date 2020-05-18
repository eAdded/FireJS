import {$} from "../index";
import {sync} from "recursive-dir-reader";
import MapComponent from "../classes/MapComponent";

export default class {
    $: $;

    constructor(globalData: $) {
        this.$ = globalData;
    }

    map() {
        const map = new Map();
        sync(this.$.config.paths.pages, (page) => {
            const rel_page = page.replace(this.$.config.paths.pages + "/", "")
            map.set(rel_page, new MapComponent(rel_page));
        })
        return map;
    };

    convertToMap(array: string[]) {
        const map = new Map();
        array.forEach(item =>
            map.set(item, new MapComponent(item)));
        return map;
    }
}