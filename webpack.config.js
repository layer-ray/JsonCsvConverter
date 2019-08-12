const HtmlWP = require('html-webpack-plugin');
const MiniCssEP = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new HtmlWP({
            template: 'public/index.html',
            filename: 'index.html'
        }),
        new MiniCssEP({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssEP.loader},
                    { loader: 'css-loader'}
                ]
            }
        ]
    }
};