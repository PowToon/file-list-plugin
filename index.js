var flatMap = require('lodash.flatmap')
var keys = require('lodash.keys')
var defaults = require('lodash.defaults')

var defaultOptions = {
  fileName: 'asset-list.txt',
  filterChunks: function defaultFilterChunks(chunk){
    return true
  },
  filterModules: function defaultFilterModules(module){
    return true
  },
  mapModules: function defaultMapModules(module){
    return keys(module.assets)
  },
  format: function defaultFormat(listItems){
    return listItems.join('\n')
  }
}

function FileListPlugin(options) {
  defaults(this, options, defaultOptions)
}

FileListPlugin.prototype.apply = function(compiler) {
  var fileName = this.fileName
  var filterChunks = this.filterChunks
  var filterModules = this.filterModules
  var mapModules = this.mapModules
  var format = this.format

  compiler.plugin('compilation', function(compilation) {
    compiler.plugin('additional-chunk-assets', function(callback){
      callback()
    })

    compilation.plugin('additional-assets', function(callback) {

      var chunks = compilation.chunks.filter(filterChunks)

      var modules = flatMap(chunks, function(chunk){
        return chunk.modules
      }).filter(filterModules)

      var listItems = flatMap(modules, mapModules)

      var list = format(listItems)

      if(typeof(list) !== 'string'){
        list = JSON.stringify(list)
      }

      compilation.assets[fileName] = {
        source: function() {
          return list
        },
        size: function() {
          return list.length
        }
      }

      callback()
    })
  })
}

module.exports = FileListPlugin
module.exports.defaultOptions = defaultOptions