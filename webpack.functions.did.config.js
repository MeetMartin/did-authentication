const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, './lambda/did'),
    entry: [
        './did.js'
    ],
    output: {
        path: path.resolve(__dirname, 'functions/did'),
        filename: 'did.js',
        libraryTarget: 'commonjs'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                sideEffects: false,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin(),
    ].filter(n => n)
};