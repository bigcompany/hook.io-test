var parseJSON = require('./parseJSON');
var request = require('request');

module['exports'] = function _request (opts, cb) {
  request({ uri: opts.uri, json: opts.json, form: opts.form, method: opts.method }, function (err, res) {
    if (err) {
      return cb(err);
    }
    var json;
    if (typeof res.body === "object") {
      json = res.body
    } else {
      json = parseJSON(res.body);
    }
    return cb(null, json);
  });
};