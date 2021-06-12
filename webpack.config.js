const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');

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
    new WebpackPwaManifest({
      name: 'Card Trader',
      short_name: 'Card Trader',
      description: 'Interactive card trading app built with React.',
      background_color: '#1b1b1b',
      theme_color: '#2f2f2f',
      icons: [
        {
          src: __dirname + '/public/logo.svg',
          sizes: [96, 128, 192, 256, 384, 512],
        }
      ]
    }),
    new FaviconsWebpackPlugin({
      logo: __dirname + '/public/logo.svg',
      inject: true,
      favicons: {
        icons: {
          android: false,
          appleIcon: [
            'apple-touch-icon.png',
          ],
          appleStartup: false,
          coast: false,
          favicons: [
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon-48x48.png',
            'favicon.ico'
          ],
          firefox: false,
          windows: false,
          yandex: false,
        }
      }
    }),
    new GenerateSW(),
  ],
  devServer: {
    historyApiFallback: true,
  }
}