"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
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
