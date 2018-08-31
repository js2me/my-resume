const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')

const optimize = process.argv.indexOf('-p') >= 0
const outPath = path.join(__dirname, './dist')
const sourcePath = path.join(__dirname, './src')

module.exports = {
  context: sourcePath,
  mode: optimize ? 'production' : 'development',
  entry: {
    main: './index.js',
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'redux'],
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js'],
    mainFields: ['browser', 'main'],
    // alias: {
    //   '~': sourcePath,
    //   icons: path.join(sourcePath, './assets/icons'),
    // },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !optimize,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'classnames-loader!style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !optimize,
                minimize: true,
                importLoaders: 2,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !optimize,
                includePaths: [path.resolve(sourcePath, './styles')],
              },
            },
          ],
        }),
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-react-loader',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]__[hash:base64:5]',
            },
          },
        ],
        exclude: /\node_modules/,
      },
      { test: /\.html$/, use: 'html-loader' },
      {
        test: /\.(png|jpg)$/,
        use: 'base64-inline-loader?limit=25000&name=[name].[ext]',
      },
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        optimize ? 'production' : 'development'
      ),
    }),
    new Webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !optimize,
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    stats: {
      warnings: false,
    },
  },
  optimization: optimize
    ? {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: { output: { comments: false } },
          }),
          new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          automaticNameDelimiter: '~',
          chunks: 'all',
        },
      }
    : undefined,
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty',
  },
}
