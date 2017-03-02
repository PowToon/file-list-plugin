function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    const prefetchList = Object.keys(compilation.assets)
      .filter(function(asset){
        return /png/.test(asset)
      })
      .join('\n')

    compilation.assets['prefetch-list.txt'] = {
      source: function() {
        return prefetchList;
      },
      size: function() {
        return prefetchList.length;
      }
    };

    callback();
  });
};

module.exports = FileListPlugin;