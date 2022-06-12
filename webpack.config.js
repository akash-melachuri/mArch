const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'src/favicon.ico',
            title: 'mArch',
            template: 'src/index.html'
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(ico)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'shader-loader'
            },
        ]
    }
};
