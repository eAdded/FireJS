import {$} from "../index";
import {exists, rename} from "fs";
import {join} from "path"
import MapComponent from "../classes/MapComponent";

export default class {
    private readonly $: $;

    constructor(globalData: $) {
        this.$ = globalData;
    }

    registerForSemiBuild(mapComponent: MapComponent) {
        return new Promise((resolve, reject) => {
            if (mapComponent.chunks.length === 0)
                resolve();
            mapComponent.chunks.forEach(chunk => {//copy chunks to lib
                const babel_abs_path = join(this.$.config.paths.babel, chunk);
                exists(babel_abs_path, exists => {
                    if (exists) {//only copy if it exists because it might be already copied before for page having same chunk
                        rename(babel_abs_path, join(this.$.config.paths.lib, chunk), err => {
                            if (err)
                                reject("Error moving chunk " + chunk);
                            else
                                resolve();
                        });
                    } else
                        resolve();
                })
            });
        });
    }
}