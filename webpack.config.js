const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './public', to: './build'}
            ]
        }),

    ],
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: ['babel-loader']
            }
        ]
      }
}