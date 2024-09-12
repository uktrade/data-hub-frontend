const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')

const config = require('./src/config')

module.exports = {
  devServer: {
    hot: true,
    static: './.build/',
  },
  devtool: config.isProd ? false : 'source-map',
  mode: config.isDev ? 'development' : 'production',
  entry: {
    shared: [
      ...(config.isDev ? ['webpack-hot-middleware/client'] : []),
      './assets/stylesheets/application.scss',
    ],
    datahub: [
      './assets/javascripts/govuk-frontend-all.js',
      './assets/javascripts/app.js',
      './src/client/DataHub/index.jsx',
    ],
    exportWinReview: './src/client/ExportWinReview/index.jsx',
  },
  output: {
    path: config.buildDir,
    publicPath: path.join('/', config.assetPath, '/'),
    filename: config.isProd ? '[name].[chunkhash:8].js' : '[name].js',
  },
  optimization: {
    sideEffects: false,
    runtimeChunk: {
      // This is needed for HMR to work with multiple entry points
      name: 'runtime',
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new MiniCssExtractPlugin({
      filename: config.isProd ? '[name].[contenthash:8].css' : '[name].css',
      chunkFilename: '[name].[id].css',
    }),
    new WebpackAssetsManifest({ output: 'assets-manifest.json' }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.sharpMinify,
        options: {
          encodeOptions: {
            jpeg: {
              // https://sharp.pixelplumbing.com/api-output#jpeg
              quality: 100,
            },
            webp: {
              // https://sharp.pixelplumbing.com/api-output#webp
              lossless: true,
            },
            avif: {
              // https://sharp.pixelplumbing.com/api-output#avif
              lossless: true,
            },
            // png by default sets the quality to 100%, which is same as lossless
            // https://sharp.pixelplumbing.com/api-output#png
            png: {},
            // gif does not support lossless compression at all
            // https://sharp.pixelplumbing.com/api-output#gif
            gif: {},
          },
        },
      },
    }),
    new webpack.HotModuleReplacementPlugin({}),
    new ReactRefreshPlugin(),
  ].filter(Boolean),
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src', 'client', 'components'),
    ],
    fallback: {
      path: false,
      fs: false,
      child_process: false,
      module: false,
      net: false,
      tls: false,
      process: false,
      os: false,
      http: false,
      https: false,
      stream: false,
      zlib: false,
      url: require.resolve('url/'),
    },
    extensions: ['.*', '.js', '.jsx', '.json'],
    alias: {
      'govuk-colours': path.resolve(__dirname, 'src/client/utils/colours.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        // Some packages need transpiling to es6 so below we exclude all node_modules but include specific modules.
        exclude:
          /node_modules\/(?!(.*(hex-rgb|set-harmonic-interval|rafz|react-spring|internmap|unified|is-plain-obj|d3-.*))\/).*/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: './babel_cache',
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: '[name].[hash:8][ext]',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // the below loaders load in reverse order
          // 3. turns css into commonjs
          {
            loader: 'css-loader',
            options: {
              sourceMap: !config.isProd,
              importLoaders: 3,
              url: {
                filter: (url) => {
                  const files = [
                    '/assets/images/icon-pointer.png',
                    '/assets/images/icon-pointer-2x.png',
                    '/assets/images/govuk-crest.png',
                    '/assets/images/govuk-crest-2x.png',
                  ]
                  return !files.some((file) => url.includes(file))
                },
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
          // 2. rewrites relative paths in url() statements based on the original source file
          'resolve-url-loader',
          // 1. turns sass into css
          {
            loader: 'sass-loader',
            options: { sourceMap: true }, // needed for resolve-url-loader
          },
        ],
      },
    ],
  },
}
