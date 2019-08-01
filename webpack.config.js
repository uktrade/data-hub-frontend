const merge = require('webpack-merge')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = require('./config')

const common = {
  devtool: 'source-map',
  entry: {
    styles: './assets/stylesheets/application.scss',
    app: [
      './assets/javascripts/govuk-frontend-all.js',
      './assets/javascripts/vendor/details.polyfill.js',
      './assets/javascripts/app.js',
      './assets/javascripts/app-vue.js',
    ],
    'activity-feed-app': [
      './src/apps/companies/apps/activity-feed/client.jsx',
    ],
  },
  output: {
    path: config.buildDir,
    publicPath: '/',
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-react'],
            ['@babel/preset-env', {
              useBuiltIns: 'entry',
              corejs: 3,
              targets: {
                browsers: ['last 2 versions', 'ie >= 8'],
              },
            }],
          ],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
          ],
          cacheDirectory: './babel_cache',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
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
                sourceMap: config.isDev,
                minimize: config.isProd,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')(),
                ],
                sourceMap: config.isDev,
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // required for resolve-url-loader
                includePaths: [
                  path.resolve(__dirname, 'node_modules/govuk_frontend_toolkit/stylesheets'),
                  path.resolve(__dirname, 'node_modules/vue-multiselect/dist'),
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
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    },
    extensions: ['*', '.js', '.jsx', '.vue', '.json'],
  },
  plugins: [
    new WebpackAssetsManifest(),
    new VueLoaderPlugin(),
  ],
  node: {
    fs: 'empty',
    child_process: 'empty',
    module: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}

const webpackEnv = process.env.WEBPACK_ENV || (config.isProd ? 'prod' : 'develop')

const envConfig = require(`./webpack.config.${webpackEnv}`)
const webpackConfig = merge.smart(common, envConfig)

module.exports = webpackConfig
