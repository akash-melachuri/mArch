const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'src/favicon.ico',
            title: 'mArch',
            template: 'src/index.html'
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        static: './dist'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'shader-loader'
            },
        ]
    }
};
