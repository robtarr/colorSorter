const webpack = require('webpack');

module.exports = {
  entry: [
    './main.js',
  ],
  output: {
    path: __dirname,
    filename: 'build/main.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
