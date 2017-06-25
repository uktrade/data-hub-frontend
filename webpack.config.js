const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const common = {
  devtool: 'source-map',
  entry: {
    styles: './assets/stylesheets/application.scss',
    app: './assets/javascripts/app.js',
    ie: ['html5shiv'],
    'trade-elements-components': './assets/javascripts/_deprecated/trade-elements/trade-elements-components.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: './babel_cache',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
      },
      {
        test: /\.(png|svg|jpe?g)$/,
        loader: [
          'file-loader?name=images/[name].[hash:8].[ext]',
          'image-webpack-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProd,
                minimize: isProd,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')(),
                ],
                sourceMap: true,
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules/govuk_frontend_toolkit/stylesheets'),
                ],
              },
            },
          ],
        }),
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  plugins: [
    new WebpackAssetsManifest(),
  ],
}

const develop = merge.smart(common, {
  output: {
    filename: 'js/[name].js',
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css'),
    new BrowserSyncPlugin({
      port: 3001,
      proxy: `http://localhost:${config.port}`,
      open: false,
      files: [
        'build/css/*.css',
        'build/javascripts/*.js',
        'build/images/*',
      ],
    }, {
      reload: false,
    }),
  ],
})

const prod = merge.smart(common, {
  devtool: 'hidden-source-map',
  output: {
    filename: 'js/[name].[chunkhash:8].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
      dead_code: true,
    }),
    new ExtractTextPlugin('css/[name].[chunkhash:8].css'),
  ],
})

if (isProd) {
  module.exports = prod
} else {
  module.exports = develop
}
