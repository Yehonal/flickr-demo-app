const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const rootPath = path.join(__dirname, '..')
const srcPath = path.join(rootPath, 'src')

const config = {
  entry: path.join(srcPath, 'index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'raw-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html')
    })
  ],
  resolve: {
    alias: {
      '@this': path.resolve(rootPath, 'src')
    }
  }
}

module.exports = {
  rootPath,
  srcPath,
  config
}
