const {isString, defaults} = require('lodash')

const defaultOptions = {
  fileName: 'asset-list.txt',
  itemsFromCompilation: function defaultItemsFromCompilation(compilation){
    return Object.keys(compilation.assets)
  },
  format: function defaultFormat(listItems){
    return listItems.join('\n')
  }
}

function FileListPlugin(options) {
  defaults(this, options, defaultOptions)
}

const pluginName = 'file-list-plugin'

FileListPlugin.prototype.apply = function(compiler) {
  const {fileName, itemsFromCompilation, format} = this

  compiler.hooks.emit.tap(pluginName, (compilation) => {
    const listItems = itemsFromCompilation(compilation)

    const list = format(listItems)

    if(!isString(list)){
      throw new Error(`${pluginName}: the format function must return a string.`)
    }

    compilation.assets[fileName] = {
      source() {
        return list
      },
      size() {
        return list.length
      }
    }
  })
}

module.exports = FileListPlugin
module.exports.defaultOptions = defaultOptions
