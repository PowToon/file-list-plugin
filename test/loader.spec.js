const fs = require('fs')
const path = require('path')
const {assign} = require('lodash')
const expect = require('expect.js')
const webpack = require('webpack')
const rimraf = require('rimraf')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FileListPlugin = require('../index')

process.traceDeprecation = true
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled rejection of:\n', p, '\nReason:\n', reason)
})

describe('file-list-plugin', () => {
  'use strict'

  const outputDir = path.resolve(__dirname, './output')

  const bundleFileName = 'bundle.js'

  const defaultAssetListFile = path.join(outputDir, FileListPlugin.defaultOptions.fileName)

  const getConfig = options => {
    const initialConfig = {
      context: path.resolve(__dirname, '../'),
      mode: 'development',
      devtool: false,
      output: {
        path: outputDir,
        filename: bundleFileName
      },
      resolve: {
        extensions: ['.js', '.scss'],
        modules: [
          path.resolve(__dirname, 'node_modules'),
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
    }

    return assign(initialConfig, options || {})
  }

  const handleWebpackErrors = function(err, stats, {expectError = false} = {}){
    if(expectError){
      if(!err){
        return new Error('Expected Error to Occur on this output!')
      }
      return
    }

    if(err){
      console.error('** WEBPACK ERROR **\n\n', err)
      return
    }

    console.log(stats.toString('errors-only'))
  }

  // Clean generated output files before each test.
  beforeEach(done => rimraf(outputDir, done))

  describe('simple usage', () => {

    it('should create a list of loaded images when importing them into js', done => {
      const config = getConfig({
        entry: './test/input/logo.js',
        plugins: [
          new ExtractTextPlugin('style.css'),
          new FileListPlugin()
        ]
      })

      webpack(config, (err, stats) => {
        handleWebpackErrors(err, stats)

        expect(err).to.be(null)

        fs.readFile(defaultAssetListFile, function(err, fileListData){
          fileListData = fileListData.toString()
          const fileListLines = fileListData.split('\n')

          expect(fileListLines.length).to.be(3)

          done()
        })
      })
    })

    it('should create a list of loaded images when importing them using url in sass', done => {
      const config = getConfig({
        entry: './test/input/scss.js',
        plugins: [
          new webpack.NoEmitOnErrorsPlugin(),
          new ExtractTextPlugin('style.css'),
          new FileListPlugin()
        ]
      })

      webpack(config, (err, stats) => {
        handleWebpackErrors(err, stats)

        expect(err).to.be(null)

        fs.readFile(defaultAssetListFile, function(err, fileListData){
          fileListData = fileListData.toString()
          const fileListLines = fileListData.split('\n')

          expect(fileListLines.length).to.be(4)

          done()
        })
      })
    })

    it('should fail when format returns not a string', done => {
      const config = getConfig({
        entry: './test/input/scss.js',
        plugins: [
          new webpack.NoEmitOnErrorsPlugin(),
          new ExtractTextPlugin('style.css'),
          new FileListPlugin({
            format: () => true
          })
        ]
      })

      webpack(config, (err, stats) => {
        handleWebpackErrors(err, stats, {expectError: true})

        expect(err).to.match(/file-list-plugin: the format function must return a string\./)

        done()
      })
    })

  })
}).timeout(5000)
