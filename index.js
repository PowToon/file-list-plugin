var _ = require('lodash')

var defaultOptions = {
  fileName: 'asset-list.txt',
  itemsFromCompilation: function defaultItemsFromCompilation(compilation){
    return _.keys(compilation.assets)
  },
  format: function defaultFormat(listItems){
    return listItems.join('\n')
  }
}

function FileListPlugin(options) {
  _.defaults(this, options, defaultOptions)
}

FileListPlugin.prototype.apply = function(compiler) {
  var fileName = this.fileName
  var itemsFromCompilation = this.itemsFromCompilation
  var format = this.format

  compiler.plugin('emit', function(compilation, callback) {
    var listItems = itemsFromCompilation(compilation)

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
