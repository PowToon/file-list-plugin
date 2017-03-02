var URI = require('urijs')

var flatMap = require('lodash.flatmap')
var keys = require('lodash.keys')
var defaults = require('lodash.defaults')

function FileListPlugin(options) {
  defaults(this, options, {
    fileName: 'asset-list.txt',

    filterModules: function defaultFilterModules(module){
      return URI(module.rawRequest).hasQuery('load', 'prefetch')
    },

    mapModules: function defaultMapModules(module){
      return keys(module.assets)
    },

    format: function defaultFormat(listEntries){
      return listEntries.join('\n')
    }
  })
}

FileListPlugin.prototype.apply = function(compiler) {
  var filterModules = this.filterModules
  var mapModules = this.mapModules
  var format = this.format
  var fileName = this.fileName

  compiler.plugin('this-compilation', function(compilation) {
    compilation.plugin('additional-assets', function(callback) {
      var modulesToList = compilation.modules.filter(filterModules)
      var assetsToList = flatMap(modulesToList, mapModules)
      var list = format(assetsToList)

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