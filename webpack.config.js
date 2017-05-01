var webpack = require("webpack");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: './src/scripts/app.js',
  output: {
    path: __dirname + '/app/scripts',
    filename: 'bundle.js',
		publicPath: '/app/',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    }),
    new BrowserSyncPlugin(
                      {
                        host: 'localhost',
                        port: 8080,
                        server: { baseDir: ['app'] }
                      }
                    )
  ]
}
