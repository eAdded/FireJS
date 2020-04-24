const StaticArchitect = require("../architects/static.architect");
const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    readTemplate(){
        return fs.readFileSync(_path.resolve(__dirname, '../web/template.html')).toString();
    }

    build(page,path,content,template) {
        console.log(path);
        fs.writeFile(_path.join(this.#$.config.paths.dist,path+".html"),StaticArchitect.createStatic(_path.join(this.#$.config.paths.babel, page), content, template),()=>{
            console.log("written");
        })
    }

}