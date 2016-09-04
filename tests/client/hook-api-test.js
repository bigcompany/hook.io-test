// hook-api-test.js
var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

var sdk = require('hook.io-sdk');

var testUser = config.testUsers.bobby;

var _config = {};
_config.host = "localhost";
_config.port = 9999;
_config.protocol = 'http';
_config.accessKey = testUser.admin_key;
console.log('config', _config)
var client = sdk.createClient(_config);

//
// Basic hook API tests
//

// create a hook
tap.test('attempt to create a new hook', function (t) {
  client.hook.create({ 
    "name": "test-hook",
    "source": 'echo "hello";',
    "language": "bash"
  }, function (err, res){
    t.error(err, 'request did not error');
    t.end();
  });
});

// get the hook
tap.test('attempt to get the test hook', function (t) {
  client.hook.get({ owner: 'david', name: 'test-hook' }, function (err, res){
    t.error(err, 'request did not error');
    t.equal(res.name, "test-hook");
    t.equal(res.source, 'echo "hello";');
    t.end();
  });
});

// run the hook
tap.test('attempt to run the test hook', function (t) {
  client.hook.run({ owner: 'david', name: 'test-hook' }, {}, function (err, res){
    t.error(err, 'request did not error');
    t.equal(res, "hello\n");
    t.end();
  });
});

// update the hook
tap.test('attempt to update the test hook', function (t) {
  client.hook.update({ owner: 'david', name: 'test-hook', source: 'echo "updated";' }, function (err, res){
    t.error(err, 'request did not error');
    t.end();
  });
});
// get the updated hook
tap.test('attempt to get the test hook', function (t) {
  client.hook.get({ owner: 'david', name: 'test-hook' }, function (err, res){
    t.error(err, 'request did not error');
    t.equal(res.name, "test-hook");
    t.equal(res.source, 'echo "updated";');
    t.end();
  });
});

// run the updated hook
tap.test('attempt to run the test hook', function (t) {
  client.hook.run({ owner: 'david', name: 'test-hook' }, {}, function (err, res){
    t.error(err, 'request did not error');
    t.equal(res, "updated\n");
    t.end();
  });
});

// destroy the hook
tap.test('attempt to destroy the test hook', function (t) {
  client.hook.destroy({ owner: 'david', name: 'test-hook' }, function (err, res){
    t.error(err, 'request did not error');
    t.end();
  });
});