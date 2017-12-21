//Konfiguracja Webpack
const webpack = require('webpack');
const path =  require("path");

module.exports = {
    entry: {
        main: "./js/app.jsx",
    },
    devServer: {
        inline: true,
        contentBase: './',
        port:9001
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, "./dist/"),
        filename: "[name].out.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query:    {
                    presets:    ["es2015", "stage-2","react"]
                }
            }
        ]
    }
}