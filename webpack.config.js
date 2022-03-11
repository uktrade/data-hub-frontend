const path = require('path')
const { spawn } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const config = require('./src/config')

/**
 * A webpack plugin that starts a node.js server after the assets are compiled.
 * This is a required step, because the node server is parsing manifest.json
 * when booting up.
 */
const StartServerAfterBuild = () => {
  let server = false
  return {
    apply: (compiler) => {
      compiler.hooks.done.tap('StartServerAfterBuild', () => {
        if (server) {
          server.stdin.write('rs\n')
        } else {
          server = spawn(
            "npx nodemon --inspect --ignore 'src/**/__test__/**/*'",
            { stdio: 'inherit', shell: true }
          )
        }
      })
    },
  }
}

module.exports = (env) => ({
  devtool: config.isProd ? false : 'source-map',
  mode: config.isProd ? 'production' : 'development',
  entry: {
    styles: './assets/stylesheets/application.scss',
    app: [
      './assets/javascripts/govuk-frontend-all.js',
      './assets/javascripts/app.js',
    ],
    'react-app': [
      'react-app-polyfill/stable',
      'details-element-polyfill',
      './src/client/index.jsx',
    ],
  },
  output: {
    path: config.buildDir,
    publicPath: '/',
    filename: config.isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  optimization: { sideEffects: false },
  plugins: [
    new MiniCssExtractPlugin({
      filename: config.isProd
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
    }),
    new WebpackAssetsManifest({ output: 'assets-manifest.json' }),
    env && env.development ? StartServerAfterBuild() : null,
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
    },
    extensions: ['*', '.js', '.jsx', '.json'],
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
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(png|svg|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[hash:8].[ext]',
            },
          },
          { loader: 'image-webpack-loader' },
        ],
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
              url: (url) => {
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
})
