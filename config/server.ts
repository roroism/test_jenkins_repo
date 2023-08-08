import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import config from './webpack.config.dev';
import port from './serve-port';

const app = express();

const compiler = webpack(config);

/**
 * Middleware to proxy requests through a specified index page.
 * ref: https://github.com/bripkens/connect-history-api-fallback
 */
app.use(connectHistoryApiFallback());

// Development middleware for use with webpack bundles.
// ref: https://github.com/webpack/webpack-dev-middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config?.output?.publicPath as string, // 임시로 옵셔널 체이닝 적용
    stats: 'errors-only',
  })
);

// Webpack hot reloading.
// ref: https://github.com/webpack-contrib/webpack-hot-middleware
app.use(webpackHotMiddleware(compiler));

// Serve app.
app.listen(port).on('error', (err: NodeJS.ErrnoException) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (err.code) {
    case 'EACCES':
      console.error(`\n\n\x1b[31m[Error] ${bind} requires elevated privileges...\x1b[0m\n`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(`\n\n\x1b[31m[Error] ${bind} is already in use...\x1b[0m\n`);
      process.exit(1);
      break;

    default:
      throw err;
  }
});
