"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function writeFileRecursively(path, data, outputFileSystem) {
    return new Promise((resolve, reject) => {
        const dir = path.substr(0, path.lastIndexOf("/"));
        outputFileSystem.mkdir(dir, { recursive: true }, err => {
            if (err)
                reject(err);
            else {
                outputFileSystem.writeFile(path, data, err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }
        });
    });
}
exports.writeFileRecursively = writeFileRecursively;
function moveChunks(mapComponent, $, outputFileSystem) {
    return new Promise((resolve, reject) => {
        if (mapComponent.chunks.length === 0)
            resolve();
        mapComponent.chunks.forEach(chunk => {
            const babel_abs_path = path_1.join($.config.paths.babel, chunk);
            outputFileSystem.exists(babel_abs_path, exists => {
                if (exists) { //only copy if it exists because it might be already copied before for page having same chunk
                    outputFileSystem.rename(babel_abs_path, path_1.join($.config.paths.lib, chunk), err => {
                        if (err)
                            reject("Error moving chunk " + chunk);
                        else
                            resolve();
                    });
                }
                else
                    resolve();
            });
        });
    });
}
exports.moveChunks = moveChunks;
function readDirRecursively(dir, inputFileSystem, callback) {
    const items = inputFileSystem.readdirSync(dir);
    items.forEach(itemName => {
        const path = `${dir}/${itemName}`;
        if (inputFileSystem.statSync(path).isDirectory())
            readDirRecursively(path, inputFileSystem, callback);
        else
            callback(path);
    });
}
exports.readDirRecursively = readDirRecursively;
