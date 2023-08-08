import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const webpackConfigBase: webpack.Configuration = {
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@app': path.resolve(__dirname, '..'),
    },
  },

  module: {
    rules: [
      /**
       * Run esbuild at JS files to transfile ES6+ code to es2015.
       */
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
      },

      /**
       * Stylesheet files with SASS.
       */
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },

      /**
       * Make inline in bundle file if smaller than 10 KB,
       * otherwise load as a file.
       */
      {
        test: /\.(png|ico|gif|svg|webp|jpe?g|mp4|webm)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'public/media/[hash].[ext]',
            },
          },
        ],
      },

      /**
       * Make font resources load as files.
       */
      {
        test: /\.(eot|ttf|woff2?|otf)$/,
        use: 'file-loader',
      },
    ],
  },

  plugins: [
    /**
     * Copies individual files or entire directories to the build directory.
     * ref: https://github.com/webpack-contrib/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '..', 'resources'),
        to: 'resources',
      },
      {
        from: path.resolve(__dirname, '..', 'public', 'media', 'favicon'),
        to: 'public/media/favicon/',
      },
      {
        from: path.resolve(__dirname, '..', 'public', 'manifest.json'),
        to: '',
        toType: 'file',
        force: true,
      },
    ]),

    /**
     * Runs typescript type checker on a separate process.
     * ref: https://github.com/Realytics/fork-ts-checker-webpack-plugin
     */
    new ForkTsCheckerWebpackPlugin(),

    /**
     * Plugin that simplifies creation of HTML files to serve your bundles
     * ref: https://github.com/jantimon/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
      filename: 'index.html',
      inject: 'body',
      hash: true,
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: false,
      },
    }),
  ],
};
