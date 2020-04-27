const StaticArchitect = require("../architects/static.architect");
const $path = require("path");
const fs = require("fs");

module.exports = class {
    #$;

    constructor(globalData) {
        this.#$ = globalData;
    }


    render(page, content, template) {
        return (this.#$.config.pro ? StaticArchitect.createStatic(
            $path.join(this.#$.config.paths.babel, page),
            content,
            template
        ) : template).replace("</body>", (() => {
            const libRelative = $path.relative(this.#$.config.paths.dist, this.#$.config.paths.lib);
            let scripts = `<script src="${libRelative}/React.js"></script><script src="${libRelative}/ReactDOM.js"></script>`;
            this.#$.map.get(page).chunks.forEach(chunk => {
                if (chunk.endsWith(".js"))
                    scripts = scripts.concat(`<script src="${libRelative}/${chunk}"></script>`);
                else if (chunk.endsWith(".css")) {
                    scripts = scripts.concat(`<link rel="stylesheet" href="${libRelative}/${chunk})}"/>`);
                } else
                    this.#$.cli.warn(`Unknown chunk type ${chunk}. Not adding to html`)
            });
            scripts = scripts.concat(`</body>`);
            return scripts;
        })());
    }

    build(page, path, content, template) {
        if (content)
            template = template.replace("</body>", `<script src="${this.#$.config.paths.pageData.replace(this.#$.config.paths.dist, "").concat("/").concat(path)}.js"></script></body>`)
        const mapComponent = this.#$.map.get(page);
        const dir = $path.join(this.#$.config.paths.dist, mapComponent.getDir());
        fs.mkdir(dir, {recursive: true}, err => {
            if (err) {
                this.#$.cli.error(`Error creating dir(s) of path ${path} for page ${page}`);
                throw new Error();
            }
            fs.writeFile($path.join(dir, mapComponent.getName() + ".html"), this.render(page, content, template), err => {
                if (err) {
                    this.#$.cli.error(`Error writing path ${path} for page ${page}`);
                    throw new Error();
                }
                this.#$.cli.ok(`Path ${path} for page ${page} successfully written`);
            });
        })
    }


}