var through = require('through2'),
  PluginError = require('plugin-error'),
  coveralls = require('coveralls');

module.exports = function() {
  return through.obj(function(file, enc, callback) {
    var stream = this;

    function handleError(done, err) {
      if (err){
        stream.emit('error', new PluginError('gulp-coveralls', err));
        done();
      }
    }

    function sendToCoverallsCallback(done, err, response, body) {
      handleError(done, err);
      if (response.statusCode >= 400){
        handleError(done, 'Bad response:' + response.statusCode + ' ' + body);
      } else {
        done();
      }
    }

    function sendToCoveralls(input, done) {
      coveralls.getBaseOptions(function(err, options){
        options.filepath = '.';
        coveralls.convertLcovToCoveralls(input, options, function(err, postData){
          handleError(done, err);
          coveralls.sendToCoveralls(postData, function(err, response, body){
            sendToCoverallsCallback(done, err, response, body);
          });
        });
      });
    }

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-coveralls', 'Stream content is not supported'));
      return callback();
    }

    if (file.isBuffer()) {
      sendToCoveralls(file.contents.toString(), callback);
      this.push(file);
    }
  });
};
