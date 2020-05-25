import MapComponent from "../classes/Page";
import {join} from "path";

export function writeFileRecursively(path: string, data: string | Buffer, outputFileSystem) {
    return new Promise((resolve, reject) => {
        const dir = path.substr(0, path.lastIndexOf("/"));
        outputFileSystem.mkdir(dir, {recursive: true}, err => {
            if (err)
                reject(err);
            else {
                outputFileSystem.writeFile(path, data, err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                })
            }
        })
    })
}

export function moveChunks(mapComponent: MapComponent, $, outputFileSystem) {
    return new Promise((resolve, reject) => {
        if (mapComponent.chunkGroup.chunks.length === 0)
            resolve();
        mapComponent.chunkGroup.chunks.forEach(chunk => {//copy chunks to lib
            const babel_abs_path = join($.config.paths.babel, chunk);
            outputFileSystem.exists(babel_abs_path, exists => {
                if (exists) {//only copy if it exists because it might be already copied before for page having same chunk
                    outputFileSystem.rename(babel_abs_path, join($.config.paths.lib, chunk), err => {
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

export function readDirRecursively(dir: string, inputFileSystem, callback) {
    const items = inputFileSystem.readdirSync(dir);
    items.forEach(itemName => {
        const path = `${dir}/${itemName}`;
        if (inputFileSystem.statSync(path).isDirectory())
            readDirRecursively(path, inputFileSystem, callback);
        else
            callback(path)
    });
}
