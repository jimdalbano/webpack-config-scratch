'use strict';

const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const publicPath = '/';
const nodeModules = path.resolve(path.join(__dirname, 'node_modules'));

const paths = require('./paths');


module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    index: paths.appIndexJs,
  },
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: '[name].js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath)
  },

  resolve: {
    modules: [
        paths.appSrc,
        paths.appFonts,
        paths.appNodeModules
    ],
    extensions: ['.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
        options: {
          failOnWarning: false
        },

        include: paths.appSrc
      },

      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.(eot|woff|woff2|ttf|svg|png|jpg|otf)$/,
          /\.scss$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'media/static/[name].[hash:8].[ext]',
        },
      },

      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader')
      },

      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|otf)$/,
        include: [
          paths.appFonts,
        ],
        loader: require.resolve('url-loader'),
        options: {
          limit: 200,
          name: paths.appBuildFonts + '[name].[hash:8].[ext]',
        },
      },

      // these run in 'reverse' order.
      // sass-loader:     process [s|c]ss -> css
      // postcss-loader:  apply transformations to css
      // css-loader:      handle css import/url() etc.
      //                  also where things like minification and
      //                  'css-modules-ization' happen.
      //
      // ExtractTextPlugin  to get CSS into separate file
      // style-loader       to inject <style> tags into DOM
      // neither of those two and CSS is bundled into js output
      {
        test: [/\.scss$/, /\.css$/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: "[name]__[local]__[hash:base64:5]",
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: function() {
                  return [
                    require('postcss-cssnext'),
                  ];
                },
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
  ]
};
