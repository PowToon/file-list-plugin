var fs = require('fs')
var path = require('path')
var assign = require('object-assign')
var expect = require('expect.js')
var webpack = require('webpack')
var rimraf = require('rimraf')

var FileListPlugin = require('../index')

describe('list-images-plugin', function () {
  'use strict'

  this.timeout(10000)

  var outputDir = path.resolve(__dirname, './output'),
    bundleFileName = 'bundle.js',
    bundleFileSrc = path.join(outputDir, bundleFileName)

  var getConfig = function (options, use) {
    use = use || [
      {
        loader: 'file-loader',
        options: {}
      }
    ]

    return assign({
      context: path.resolve(__dirname, '../'),
      output: {
        path: outputDir,
        filename: bundleFileName
      },
      module: {
        rules: [
          {
            test: /\.png/,
            exclude: /node_modules/,
            use: use
          }
        ]
      }
    }, options || {})
  }

  // Clean generated cache files before each test so that we can call each test with an empty state.
  beforeEach(function (done) {
    rimraf(outputDir, done)
  })

  describe('simple usage', function () {
    it('should create a list of loaded images when using file loader', function (done) {
      var config = getConfig({
        entry: './test/input/logo.js',
        plugins: [
          new FileListPlugin()
        ]
      })

      webpack(config, function (err) {
        expect(err).to.be(null)

        fs.readFile(bundleFileSrc, function (err, data) {

          var encoded = (0, eval)(data.toString())

          console.log(encoded)

          done()
        })

      })
    })
  })
})