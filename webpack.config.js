const webpack = require('webpack')
const prod = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'source-map',
  entry: {
    app: './src/javascripts/app.js',
    'company-investment-tab-form': './src/javascripts/company-investment-tab-form',
    'company-add': './src/javascripts/company-add',
    'company-edit': './src/javascripts/company-edit',
    'contact-edit': './src/javascripts/contact-edit',
    investment: './src/javascripts/investment',
    'create-investment': './src/javascripts/create-investment',
    'expandable-card': './src/javascripts/expandable-card',
    index: './src/javascripts/index',
    search: './src/javascripts/search',
    'service-delivery': './src/javascripts/service-delivery',
    'archive-form': './src/javascripts/archive-form',
    'add-another-field': './src/javascripts/add-another-field'
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
