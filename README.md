# FileListPlugin

A webpack plugin to list deployed files.

## Usage

```
var FileListPlugin = require('file-list-plugin')

plugins: [
  ...
  new FileListPlugin()
]
```

A deployment using this plugin with default options looks like this:

```
- bundle.js
- 217df66c16f6ad3a523aa7baf6223da3.png
- 38889dd6a712a67410ecdbc8cc0877fc.png
- asset-list.txt
```

Where the content of `asset-list-txt` is:
```
217df66c16f6ad3a523aa7baf6223da3.png
38889dd6a712a67410ecdbc8cc0877fc.png
```

## Options

```
new FileListPlugin({

  // file name of the file the plugin will output
  fileName: 'asset-list.txt',
  
  // how a compilation is transformed onto the items list
  itemsFromCompilation: function defaultItemsFromCompilation(compilation){
    return _.keys(compilation.assets)
  },
  
  // how to format the list from list items
  format: function defaultFormat(listItems){
    return listItems.join('\n')
  }
})
```

#Changelog

* 0.1.0 -
    * **BREAKING CHANGE** - `itemsFromCompilation` is now exposed instead of `filterChunks`, `filterModules` and `mapModules`.
    * Updated all npm packages and added new npm's `package-lock.json`.
    * Updated tests to support webpack 3 and improved them.
* 0.0.5 - first stable version.