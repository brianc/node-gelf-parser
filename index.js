var Transform = require('stream').Transform;
var util = require('util');
var zlib = require('zlib');

var GelfParser = function() {
  Transform.call(this, {objectMode: true});
};

util.inherits(GelfParser, Transform);

GelfParser.prototype._transform = function(chunk, encoding, callback) {
  var self = this;
  zlib.inflate(chunk, function(err, res) {
    if(err) return callback(err);
    self.push(JSON.parse(res));
    callback();
  });
};

GelfParser.prototype._flush = function(callback) {
  callback();
};

module.exports = GelfParser;
