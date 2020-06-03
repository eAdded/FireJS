module.exports = {
    entry: "./index.js",
    mode: "production",
    output: {
        filename: "i[contentHash].js",
    }
}