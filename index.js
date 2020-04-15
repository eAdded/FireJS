/**
 * @return {{pageArchitect: (function(): *), webpackArchitect: (function(*=): {mode: string, output: {path: string, filename: string}, entry: (string|*)[], plugins: *[], module: {rules: *[]}, name: string, target: string})}}
 */
module.exports = {
    pageArchitect: require("./architects/page.architect"),
    webpackArchitect : require("./architects/webpack.architect")
}