const {Compilation, sources} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');

/** @typedef {import('webpack').Compiler} Compiler */
class AddMaskableIcons {

  /**
   * @param {Compiler} compiler 
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(AddMaskableIcons.name, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: AddMaskableIcons.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          for (const file of Object.keys(compilation.assets)) {
            if (!/manifest/.test(file)) continue;
            const contents = compilation.getAsset(file);
            const json = JSON.parse(contents.source.source());
            const maskables = json.icons.map(i => ({...i, purpose: 'maskable'}));
            json.icons.push(...maskables);
            compilation.updateAsset(
              file,
              new sources.RawSource(JSON.stringify(json)),
            )
          }
        }
      )
    });
  }
}

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
      inject: true,
      favicons:{
        name: 'Card Trader',
        short_name: 'Card Trader',
        description: 'Interactive card trading app built with React.',
        background_color: '#1b1b1b',
        theme_color: '#2f2f2f',
        start_url: '/',
        manifestRelativePaths: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        }
      }
    }),
    new GenerateSW(),
    new AddMaskableIcons(),
  ],
  devServer: {
    historyApiFallback: true,
  }
}