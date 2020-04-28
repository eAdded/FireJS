const fs = require("fs");
module.exports = class {
    static writeFileRecursively(path, data) {
        new Promise((resolve, reject) => {
            const dir = path.substr(0, path.lastIndexOf("/"));
            fs.mkdir(dir, {recursive: true}, err => {
                if (err)
                    reject(err);
                else {
                    fs.writeFile(path, data, err => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    })
                }
            })
        })
    }
}