module.exports = {
    entry: "./Wrapper.js",
    mode: "production",
    output: {
        filename: "wrapper.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                },
            }
        ],
    }
}