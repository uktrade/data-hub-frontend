const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require('./src/config')

module.exports = {
  output: {
    filename: 'js/[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css'),
    new BrowserSyncPlugin({
      port: 3001,
      proxy: `http://localhost:${config.port}`,
      open: false,
      files: [
        '.build/css/*.css',
        '.build/js/*.js',
        '.build/images/*',
        'src/**/*.njk',
      ],
    }, {
      reload: false,
    }),
  ],
}
