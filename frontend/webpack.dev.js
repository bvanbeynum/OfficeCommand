const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './frontend/index.js', // Entry point for your React app
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build'), // Output to the root 'build' directory
    publicPath: '/' // Ensure assets are served from root
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './frontend/index.html', // Path to your template HTML file
      filename: 'index.html' // Name of the output HTML file in the build folder
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
