module.exports = [
    {
        entry: "./Wrapper.js",
        mode: "production",
        output: {
            filename: "wrapper.bundle.js",
            libraryTarget: "commonjs2"
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
    }, {
        entry: "./index.js",
        mode: "production",
        output: {
            filename: "index.bundle.js",
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
]