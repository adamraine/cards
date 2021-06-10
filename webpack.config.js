const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  devtool: 'source-map',
  entry: __dirname + '/src/index.tsx',
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html',
      inject: 'head',
    }),
    new FaviconsWebpackPlugin({
      logo: __dirname + '/public/logo.svg',
      mode: 'webapp',
      prefix: '',
      inject: true,
      manifest: __dirname + '/public/manifest.json',
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: [
            'favicon.ico',
          ],
          firefox: false,
          windows: false,
          yandex: false,
        }
      }
    }),
  ],
  devServer: {
    historyApiFallback: true,
  }
}