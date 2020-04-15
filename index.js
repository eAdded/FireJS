require("./config/global.config")
module.exports = {
    pageArchitect: require("./architects/page.architect"),
    webpackArchitect : require("./architects/webpack.architect")
}