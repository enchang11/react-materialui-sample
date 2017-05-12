const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {


  // Entry points to the project
  entry: [
    //'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client',
    path.join(__dirname, '/app/src/app.js'),
  ],
  // Server Configuration options
  // devServer: {
  //   contentBase: 'app', // Relative directory for base of server
  //   devtool: 'eval',
  //   hot: true, // Live-reload
  //   inline: true,
  //   port: 3010, // Port Number
  //   host: '192.168.0.115', // Change to '0.0.0.0' for external facing server
  // },
  devtool: 'eval',
  output: {
    path: "/",
    filename: 'app.js'
  },
  plugins: [
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),
    // Moves files
    new TransferWebpackPlugin([
      //{from: 'www'},
    ], path.resolve(__dirname, 'app')),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, // All .js files
        loaders: ['babel-loader'],
        exclude: [nodeModulesPath],
      },
    ],
  },
};

module.exports = config;
