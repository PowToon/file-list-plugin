var fs = require('fs')
var path = require('path')
var assign = require('object-assign')
var expect = require('expect.js')
var webpack = require('webpack')
var rimraf = require('rimraf')

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
        extensions: ['.js', '.scss', '.png'],
        modules: ['node_modules']
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              { loader: 'css-loader' },
              { loader: 'sass-loader' }
            ]
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

  // Clean generated cache files before each test so that we can call each test with an empty state.
  afterEach(function (done) {
    rimraf(outputDir, done)
  })

  describe('simple usage', function () {
    it('should create a list of loaded images when importing them into js', function (done) {
      var config = getConfig({
        entry: './test/input/logo.js',
        plugins: [
          new FileListPlugin()
        ]
      })

      webpack(config, function (err) {
        expect(err).to.be(null)

        fs.readFile(defaultAssetListFile, function(err, fileListData){
          fileListData = fileListData.toString()
          var fileListLines = fileListData.split('\n')

          expect(fileListLines.length).to.be(2)

          fs.readFile(bundleFileSrc, function(err, bundleFileData){
            bundleFileData = bundleFileData.toString()

            fileListLines.forEach(function(line){

              expect(line.indexOf('.png')).to.not.be(-1)

              expect(bundleFileData.indexOf(line)).to.not.be(-1)

            })

            done()
          })
        })
      })
    })
    it('should create a list of loaded images when importing them using url in sass', function (done) {
      var config = getConfig({
        entry: './test/input/scss.js',
        plugins: [
          new FileListPlugin()
        ]
      })

      webpack(config, function (err) {
        expect(err).to.be(null)

        fs.readFile(defaultAssetListFile, function(err, fileListData){
          fileListData = fileListData.toString()
          var fileListLines = fileListData.split('\n')

          expect(fileListLines.length).to.be(2)

          fs.readFile(bundleFileSrc, function(err, bundleFileData){
            bundleFileData = bundleFileData.toString()

            fileListLines.forEach(function(line){

              expect(line.indexOf('.png')).to.not.be(-1)

              expect(bundleFileData.indexOf(line)).to.not.be(-1)

            })

            done()
          })
        })
      })
    })
  })
})