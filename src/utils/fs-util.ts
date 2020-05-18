import {mkdir, writeFile} from "fs";

export function writeFileRecursively(path, data) {
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
