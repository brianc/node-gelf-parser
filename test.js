var assert = require('assert');
var crypto = require('crypto');
var zlib = require('zlib');

var ok = require('okay');

var GelfParser = require(__dirname)
describe('GelfParser', function() {
  it('reads a simple packet', function(done) {
    var parser = new GelfParser();
    var msg = {
      version: '1.0'
    };
    var packet = JSON.stringify(msg);
    zlib.deflate(packet, ok(function(buff) {
      parser.write(buff);
      parser.on('readable', function() {
        var message = parser.read();
        assert.deepEqual(msg, message);
        done();
      });
    }));
  });

  it('reads a huge packet', function(done) {
    var full_message = crypto.pseudoRandomBytes(32000).toString('utf8');
    var msg = {
      version: '1.0',
      short_message: 'huge text',
      full_message: full_message,
      timestamp: new Date().getTime(),
      facility: 'happiness'
    };
    var packet = JSON.stringify(msg);
    zlib.deflate(packet, ok(function(buff) {
      var len = buff.length;
      assert(len > 9000);
      done();
    }));
  });
});
