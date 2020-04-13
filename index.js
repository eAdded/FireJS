const config = require("./config/default.config");
const pageBundeler = require("./bundelers/page.bundeler")
const path = require("path")
const fs = require("fs");

fs.readdir(path.join(config.src,"pages"),(err,files)=>{
    if(err)
        console.error("error while reading pages");
    else {
        pageBundeler(files);
    }
});
