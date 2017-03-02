var _ = require('lodash')

var defaultOptions = {
  fileName: 'asset-list.txt',
  filterChunks: function defaultFilterChunks(chunk){
    return true
  },
  filterModules: function defaultFilterModules(module){
    return true
  },
  mapModules: function defaultMapModules(module){
    return _.keys(module.assets)
  },
  format: function defaultFormat(listItems){
    return _.uniq(listItems).join('\n')
  }
}

function FileListPlugin(options) {
  _.defaults(this, options, defaultOptions)
}

FileListPlugin.prototype.apply = function(compiler) {
  var fileName = this.fileName
  var filterChunks = this.filterChunks
  var filterModules = this.filterModules
  var mapModules = this.mapModules
  var format = this.format

  compiler.plugin('emit', function(compilation, callback) {
    var chunks = compilation.chunks.filter(filterChunks)

    var modules = _.flatMap(chunks, 'modules')
      .filter(filterModules)

    var listItems = _.flatMap(modules, mapModules)

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
}

module.exports = FileListPlugin
module.exports.defaultOptions = defaultOptions