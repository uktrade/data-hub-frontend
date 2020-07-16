const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: false,
  output: {
    filename: 'js/[name].[chunkhash:8].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin('css/[name].[contenthash:8].css'),
  ],
}
