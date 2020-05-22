import {exists, mkdir, rename, writeFile} from "fs";
import MapComponent from "../classes/Page";
import {join} from "path";

export function writeFileRecursively(path: string, data: string | Buffer) {
    return new Promise((resolve, reject) => {
        const dir = path.substr(0, path.lastIndexOf("/"));
        mkdir(dir, {recursive: true}, err => {
            if (err)
                reject(err);
            else {
                writeFile(path, data, err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                })
            }
        })
    })
}

export function moveChunks(mapComponent: MapComponent, $) {
    return new Promise((resolve, reject) => {
        if (mapComponent.chunkGroup.chunks.length === 0)
            resolve();
        mapComponent.chunkGroup.chunks.forEach(chunk => {//copy chunks to lib
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