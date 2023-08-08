import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import CaseSensitivePathsWebpackPlugin from 'case-sensitive-paths-webpack-plugin';
import { webpackConfigBase } from './webpack.config.base';
import port from './serve-port';

const config: webpack.Configuration = merge(webpackConfigBase, {
  mode: 'development',

  entry: [
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr&reload=true`,
    './src/index.tsx',
  ],

  devtool: 'inline-source-map',

  output: {
    pathinfo: true,
    publicPath: '/',
    filename: 'public/js/[name].bundle.js',
    chunkFilename: 'public/js/[name].chunk.js',

    /**
     * Point sourcemap entries to original disk location (format as URL on Windows)
     */
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },

  plugins: [
    /**
     * Add development environment.
     * ref: https://webpack.js.Forg/plugins/define-plugin/
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),

    /**
     * Enables Hot Module Replacement, otherwise known as HMR.
     * ref: https://webpack.js.org/plugins/hot-module-replacement-plugin/
     */
    new webpack.HotModuleReplacementPlugin(),

    /**
     * Enforces the entire path of all required modules.
     * ref: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
     */
    new CaseSensitivePathsWebpackPlugin(),

    /**
     * Dashboard for your webpack dev server.
     */
    // new WebpackDashboardPlugin(),
  ],

  /**
   * During development, dont interest of speed.
   */
  performance: {
    hints: false,
  },
});

export default config;
