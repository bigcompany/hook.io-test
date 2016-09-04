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
var client = sdk.createClient(_config);

/*

    HOOK CONCURRENCY LIMIT TESTS

*/
// create new hook with 2 second timer
tap.test('attempt to create a new hook with delay - authorized api key', function (t) {
  client.hook.create({ 
    "name": "test-hook-concurrency",
    "source": 'sleep 5;\necho "hello";',
    "language": "bash"
  }, function (err, res){
    t.error(err);
    console.log('res', res)
    t.equal(typeof res, "object");
    t.equal(res.status, "created");
    t.end();
  });
});

tap.test('attempt to run 4 hooks at once', function (t) {
  t.plan(4);
  // TODO: actually parse every response and ensure at least one contains concurrency error
  client.hook.run({ owner: "david", name: "test-hook-concurrency" }, { "foo": "bar" }, function (err, res) {
    console.log(err, res)
    t.error(err);
  });
  client.hook.run({ owner: "david", name: "test-hook-concurrency" }, { "foo": "bar" }, function (err, res) {
    console.log(err, res)
    t.error(err);
  });
  client.hook.run({ owner: "david", name: "test-hook-concurrency" }, { "foo": "bar" }, function (err, res) {
    console.log(err, res)
    t.error(err);
  });
  setTimeout(function(){
    client.hook.run({ owner: "david", name: "test-hook-concurrency" }, { "foo": "bar" }, function (err, res) {
      console.log(err, res)
      t.error(err);
    });
  }, 2000);
});

tap.test('attempt to delete the hook we just created - correct access key', function (t) {
  client.hook.destroy({ owner: 'david', name: 'test-hook-concurrency' }, function (err, res){
    t.error(err);
    console.log('rrr', res)
    t.end();
  });
});