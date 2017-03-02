# FileListPlugin

A webpack plugin to list all used assets

## Usage

```
plugins: [
  new FileListPlugin({
  
    // The file the plugin will output
    fileName: 'asset-list.txt',
    
    // Decide what chunks to include in the list
    filterChunks: function defaultFilterChunks(chunk){
      return true
    },
    
    // Decide what modules to include in th list
    filterModules: function defaultFilterModules(module){
      return true
    },
    
    // Decide how to map a module to list entries
    mapModules: function defaultMapModules(module){
      return keys(module.assets)
    },
    
    // Decide how to format the list
    format: function defaultFormat(listItems){
      return listItems.join('\n')
    }
  })
]
```