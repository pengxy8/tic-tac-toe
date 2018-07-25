const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {loader: 'html-loader'},
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        // options: {
                        //     modules: true,
                        //     sourceMap: true
                        // }
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                        //plugins: ['transform-runtime'],
                        sourceMap: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].map',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
    ],
};
