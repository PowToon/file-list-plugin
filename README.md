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
  
  // what chunks to include in the list
  filterChunks: function defaultFilterChunks(chunk){
    return true
  },
  
  // what modules to include in th list
  filterModules: function defaultFilterModules(module){
    return true
  },
  
  // how to map a module to list entries,
  // by default, module assets are used
  mapModules: function defaultMapModules(module){
    return _.keys(module.assets)
  },
  
  // how to format the list from list items
  format: function defaultFormat(listItems){
    return _.uniq(listItems).join('\n')
  }
})
```