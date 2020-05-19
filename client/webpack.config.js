const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',

  plugins: [
    // Clean the ./dist directory.
    new CleanWebpackPlugin(),
    // Copy all the files, as static web files
    new CopyWebpackPlugin([
      {from:'./assets',to:'assets'},
      {from:'./components',to:'components'}
    ]),
    // Web entrypoint
    new HtmlWebpackPlugin({ template: './index.html' })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 1962,
    proxy: {
      "/api": "http://localhost:4545"
    }
  }
};