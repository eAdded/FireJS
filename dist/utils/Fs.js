"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function writeFileRecursively(path, data) {
    return new Promise((resolve, reject) => {
        const dir = path.substr(0, path.lastIndexOf("/"));
        fs_1.mkdir(dir, { recursive: true }, err => {
            if (err)
                reject(err);
            else {
                fs_1.writeFile(path, data, err => {
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
function moveChunks(mapComponent, $) {
    return new Promise((resolve, reject) => {
        if (mapComponent.chunkGroup.chunks.length === 0)
            resolve();
        mapComponent.chunkGroup.chunks.forEach(chunk => {
            const babel_abs_path = path_1.join(this.$.config.paths.babel, chunk);
            fs_1.exists(babel_abs_path, exists => {
                if (exists) { //only copy if it exists because it might be already copied before for page having same chunk
                    fs_1.rename(babel_abs_path, path_1.join(this.$.config.paths.lib, chunk), err => {
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
