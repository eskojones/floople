var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        main:'./frontend/components/App.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'frontend/public/javascript'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: process.env.NODE_ENV ? [
    ] : []
};