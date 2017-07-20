var fs = require('fs')
var path = require('path')
var assign = require('object-assign')
var expect = require('expect.js')
var webpack = require('webpack')
var rimraf = require('rimraf')

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var FileListPlugin = require('../index')

describe('file-list-plugin', function () {
  'use strict'

  this.timeout(10000)

  var outputDir = path.resolve(__dirname, './output'),
    bundleFileName = 'bundle.js',
    bundleFileSrc = path.join(outputDir, bundleFileName),
    defaultAssetListFile = path.join(outputDir, FileListPlugin.defaultOptions.fileName)

  var getConfig = function (options) {
    return assign({
      context: path.resolve(__dirname, '../'),
      output: {
        path: outputDir,
        filename: bundleFileName
      },
      resolve: {
        extensions: ['.js', '.scss'],
        modules: [
          'node_modules',
          path.resolve(__dirname, './input')
        ],
        unsafeCache: false
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
          },
          {
            test: /\.png$/,
            use: [
              { loader: 'file-loader' }
            ]
          }
        ]
      }
    }, options || {})
  }

  var handleWebpackErrors = function(err, stats){
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({
      chunks: true,
      colors: true
    }));
  }

  // Clean generated cache files before each test so that we can call each test with an empty state.
  beforeEach(function (done) {
    rimraf(outputDir, done)
  })

  describe('simple usage', function () {
    it('should create a list of loaded images when importing them into js', function (done) {
      var config = getConfig({
        entry: './test/input/logo.js',
        plugins: [
          new webpack.NoEmitOnErrorsPlugin(),
          new ExtractTextPlugin('style.css'),
          new FileListPlugin()
        ]
      })

      webpack(config, function (err, stats) {
        handleWebpackErrors(err, stats)

        expect(err).to.be(null)

        fs.readFile(defaultAssetListFile, function(err, fileListData){
          fileListData = fileListData.toString()
          var fileListLines = fileListData.split('\n')

          expect(fileListLines.length).to.be(3)

          done()
        })
      })
    })
    it('should create a list of loaded images when importing them using url in sass', function (done) {
      var config = getConfig({
        entry: './test/input/scss.js',
        plugins: [
          new webpack.NoEmitOnErrorsPlugin(),
          new ExtractTextPlugin('style.css'),
          new FileListPlugin()
        ]
      })

      webpack(config, function (err, stats) {
        handleWebpackErrors(err, stats)
        expect(err).to.be(null)

        fs.readFile(defaultAssetListFile, function(err, fileListData){
          fileListData = fileListData.toString()
          var fileListLines = fileListData.split('\n')

          expect(fileListLines.length).to.be(4)

          done()
        })
      })
    })
  })
})