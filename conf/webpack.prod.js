const { config, rootPath } = require('./webpack.config')
const path = require('path')

module.exports = {
  ...config,
  mode: 'production',
  output: {
    path: path.join(rootPath, 'dist'),
    filename: 'bundle.js'
  },
  optimization: {
    minimize: true
  }
}
