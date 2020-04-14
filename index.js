const config = require("./config/default.config");
const pageBundeler = require("./bundelers/page.bundeler");
const webpackArchitect = require("./architects/webpack.architect");
const readdir = require("recursive-dir-reader")

let wp_configs = [];
readdir.sync(config.pages, file => {
    console.log(file.replace(config.pages+"/",""))
    wp_configs.push(webpackArchitect(file));
});
pageBundeler.fromConfigs(wp_configs);