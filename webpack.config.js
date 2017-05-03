const webpack = require('webpack')
const prod = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'source-map',
  entry: {
    companyinvestmenttabform: './src/javascripts/companyinvestmenttabform',
    companyadd: './src/javascripts/companyadd',
    companyedit: './src/javascripts/companyedit',
    contactedit: './src/javascripts/contactedit',
    investment: './src/javascripts/investment',
    createinvestment: './src/javascripts/createinvestment',
    index: './src/javascripts/index',
    search: './src/javascripts/search',
    servicedelivery: './src/javascripts/servicedelivery'
  },
  output: {
    path: 'build/javascripts',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: './babel_cache'
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    modules: [
      'src',
      'node_modules'
    ]
  },
  plugins: prod ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false,
      dead_code: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ]
}
