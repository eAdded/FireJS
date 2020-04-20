const {config: {pageData, plugins}} = require("../store/global.data");
const path = require("path");
const fs = require("fs");
const cli = require("../utils/cli-color");

function createPageData(page) {
    fs.writeFile(path.join(page.filepath, "pageData.json"), JSON.stringify(page.data), err => {
        if (err)
            cli.error(`error writing page data to ${page.path}/index.json with err`, err);
        else {
            cli.ok(`Successfully wrote data for page ${page.path}`);
        }
    });
}

plugins.forEach(plugin => {
    require(plugin)().then(pages => {
        pages.forEach(page => {
            page.filepath = path.join(pageData, page.path);
            fs.exists(page.filepath, exists => {
                if (!exists)
                    fs.mkdir(page.filepath, {recursive: true}, err => {
                        if (err)
                            cli.error(`error creating dir ${page.filepath}`);
                        else
                            createPageData(page);
                    });
                else
                    createPageData(page);
            });
        });
    })
});

module.exports = () => {
    plugins.forEach(plugin => {
        Object.keys(require(plugin)()).forEach(key => {

        });
    })
}