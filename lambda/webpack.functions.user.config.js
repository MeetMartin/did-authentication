const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, './user'),
    entry: [
        './user.js'
    ],
    output: {
        path: path.resolve(__dirname, '../functions/user'),
        filename: 'user.js',
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