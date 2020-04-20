const {config: {paths: {pages}}} = require("../store/global.data");
const readdir = require("recursive-dir-reader");

module.exports.getMap = () => {
    const map = {};
    readdir.sync(pages, (pagePaths) => {
        map[pagePaths.replace(pages+"/", "")] = undefined;
    })
    return map;
};
