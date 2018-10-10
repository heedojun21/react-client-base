
//copy this and paste it to webpack.config.js when deploy production mode.

var webpack = require('webpack');
const path = require("path");


module.exports = {
  entry: [
   // './src/index.js'
    path.resolve(__dirname, './src/index.js')
  ],

  output: {
    path: path.join(__dirname),
    filename: "bundle.js"
  },
  /*output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'

  },
*/

  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel'

      },

      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" }
      //이 밑에 두개가 image show 를 위한 loader들.
      //    { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      //   { test: /\.(jpe?g|png|gif|svg)$/, loader: 'file-loader?name=[imagePath][name].[ext]' },
      //loader: loader: 'file-loader?name=[path][name].[ext]'"
      //   { test: /\.html$/, exclude: /node_modules/,loader: 'html-loader'},

    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  devServer: {
   historyApiFallback: true,
   contentBase: './'
   }
};



