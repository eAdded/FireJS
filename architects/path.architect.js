const StaticArchitect = require("../architects/static.architect");
const _path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }

    readTemplate(callback) {
        fs.readFile(_path.resolve(__dirname, '../web/template.html'), {}, (err, data) => {
            callback(err, data.toString());
        })
    }

    render(page, content, template) {
        return  StaticArchitect.createStatic(
            _path.join(this.#$.config.paths.babel, page),
            content,
            template
        ).replace("</body>",(()=>{
            let scripts = "";
            const libRelative = this.#$.config.paths.lib.replace(this.#$.config.paths.dist,"");
            this.#$.map[page].chunks.forEach(chunk=>{
                scripts = scripts.concat(`<script src="${libRelative}/${chunk}"></script>`);
            })
            scripts = scripts.concat("</body>")
            return scripts;
        })());
    }

    buildRest(template) {
        Object.keys(this.#$.map).forEach(page => {
            if (!page.didRender) {
                this.#$.map[page].didRender = true;
                this.build(page, page.substr(0, page.lastIndexOf(".")), {}, template);
            }
        })
    }

    build(page, path, content, template) {
        const absPath = _path.join(this.#$.config.paths.dist, path + ".html");
        const {dir} = _path.parse(absPath);
        fs.mkdir(dir,{recursive:true},err=>{
            if (err) {
                this.#$.cli.error(`Error creating dir(s) of path ${path} for page ${page}`);
                throw new Error();
            }
            fs.writeFile(absPath, this.render(page, content, template), err => {
                if (err) {
                    this.#$.cli.error(`Error writing path ${path} for page ${page}`);
                    throw new Error();
                }
                this.#$.cli.ok(`Path ${path} for page ${page} successfully written`);
            });
        })

    }

}