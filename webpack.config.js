var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        site:'./frontend/components/Site.jsx',
        app:'./frontend/components/App.jsx',
        login: './frontend/components/Login.jsx',
        signup: './frontend/components/Signup.jsx'
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