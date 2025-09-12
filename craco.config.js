const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Optimize for faster development builds
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };

      // Reduce bundle analysis overhead
      webpackConfig.stats = 'minimal';
      
      // Optimize resolve
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve.alias,
          '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.jsx', '.json'],
      };

      // Disable source maps in development for faster builds
      webpackConfig.devtool = false;

      return webpackConfig;
    },
  },
  devServer: {
    // Optimize dev server
    hot: true,
    liveReload: false,
    compress: true,
    historyApiFallback: true,
    // Reduce polling overhead
    watchOptions: {
      poll: false,
      ignored: /node_modules/,
    },
  },
};
