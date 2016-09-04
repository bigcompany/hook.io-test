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
var anonClient = sdk.createClient({ accessKey: '' });

var client = sdk.createClient(_config);

//
// gateway tests for executing hot code against the /gateway API endpoint
// the gateway is used for running code without having to create a hook service

// exec a simple bash service as anonymous user
tap.test('attempt to exec a simple bash service as anonymous user', function (t) {
  anonClient.hook.exec({ "code": 'echo "hello"', "language": "bash", "data":  { "foo": "bar" } }, function (err, res) {
    console.log(err, res);
    t.error(err, 'request did not error');
    t.equal(res, "hello\n");
    t.end();
  });
});

// exec bash service as logged in user
tap.test('attempt to exec a simple bash service as registered user', function (t) {
  client.hook.exec({ "code": 'echo "hello"', "language": "bash", "data":  { "foo": "bar" } }, function (err, res) {
    console.log(err, res);
    t.error(err, 'request did not error');
    t.equal(res, "hello\n");
    t.end();
  });
});

// exec a bash service with a simple type of error
tap.test('attempt to exec a bash service with a simple type of error', function (t) {
  client.hook.exec({ "code": 'asd', "language": "bash", "data":  { "foo": "bar" } }, function (err, res) {
    console.log(err, res);
    t.error(err, 'request did not error');
    t.end();
  });
});

// exec a js service which echos some important info
tap.test('attempt to exec a js service which echos some important info', function (t) {
  
  var echoService = function (h) {
    var rsp = {};
    rsp.owner = h.resource.owner;
    rsp.name = h.resource.name;
    rsp.params = h.params;
    rsp.env = h.env;
    h.res.json(rsp);
  };
  
  client.hook.exec({
    "code": 'module.exports = ' + echoService.toString(),
    "language": "javascript",
    "data":  { "foo": "bar" }
  }, function (err, res) {
    console.log(err, res);
    t.error(err, 'request did not error');
    t.equal(res.name, "gateway");
    t.equal(res.owner, "david");
    t.equal(typeof res.params, "object");
    t.equal(res.params.foo, "bar");
    t.equal(typeof res.env, "object");
    t.end();
  });
});


return;


client.hook.exec({ 
  "code": "module.exports = function (opts){return opts.res.end(opts.resource.owner);opts.res.json(opts.env);}",
  "language": "javascript",
  "data": { "foo": "bar" }
 }, function (err, res){
  console.log(err, res)
});

return;

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