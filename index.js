const config = require("./config/default.config");
const pageBundeler = require("./bundelers/page.bundeler");
const readdir = require("recursive-dir-reader")

pageBundeler(readdir.sync(config.pages));