const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const mode = process.env.NODE_ENV || "development"

module.exports = {
    mode: mode,
    entry: './src/canvas.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    // could replace the next line with "style-loader" here for inline css
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    // according to the docs, sass-loader should be at the bottom, which
                    // loads it first to avoid prefixes in your sourcemaps and other issues.
                    'sass-loader'
                ]
                    
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    // without additional settings, this will reference .babelrc
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html'
        }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        open: true,
        // port: 3000
    },
    devtool: 'source-map'
};