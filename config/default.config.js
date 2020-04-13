const path = require("path");
const globalConfig = require("./global.config");
const fs = require("fs");

const defaults = {
    src: path.join(globalConfig.root, "src"),
    plugins: [],
    template: "./template.html",
    webpack: (() => {
        const userpack = path.join(globalConfig.root, "webpack.config.js");
        if (fs.existsSync(userpack))
            return userpack
        else
            return undefined;
    })() //return undefined if user webpack does not exists
};

module.exports = (() => {
    const userConfigFile = path.resolve(__dirname, "node-config");
    //check if user has a config file
    //if no user config is found the return default config
    if (!fs.existsSync(userConfigFile))
        return defaults;
    else //if user has one then override defaults with user config
        return {
            ...defaults,
            ...require(userConfigFile),
        }
})();