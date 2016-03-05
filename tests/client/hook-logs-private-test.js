var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

// Bobby is a pre-generated user 
var testUser = config.testUsers.bobby;

// private hooks / secure logs

tap.test('attempt to create a new private hook - authorized api key', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { 
      name: "test-private-hook", 
      hook_private_key: testUser.admin_key,
      language: "javascript",
      source: 'module["exports"] = function (h) {console.log("logging");h.res.end("ended");}',
      hookSource: "code",
      isPrivate: true
    }}, function (err, res) {
    t.error(err);
    res = res || {};
    t.equal(res.error, undefined, "no errors");
    t.equal(res.type, undefined, "no error type");
    t.equal(res.message, undefined, "no error message");
    t.end();
  });
});

tap.test('attempt to view logs for newly created hook - read only access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/logs", method: "POST", json: { hook_private_key: testUser.read_only } }, function (err, res) {
    t.error(err);
    console.log(err, res)
    t.equal(typeof res, "object", "returned json object");
    t.equal(res.length, 0, "found no log entries");
    t.end();
  });
});

tap.test('attempt to view logs for newly created hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/logs", method: "GET", json: true }, function (err, res) {
    t.error(err, 'did not error');
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

tap.test('attempt to run the private hook - run access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "POST", json: { hook_private_key: testUser.run_key } }, function (err, res) {
    t.error(err);
    t.equal(res, 'ended\n', 'returned correct result');
    t.end();
  });
});

tap.test('attempt to view logs for newly created hook - read access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/logs", method: "POST", json: { hook_private_key: testUser.read_only } }, function (err, res) {
    t.error(err);
    t.equal(typeof res, "object", "returned json object");
    t.equal(res.length, 1, "found one log entry");
    t.end();
  });
});

tap.test('attempt to flush logs for the hook we just created a new hook - correct access key', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/logs?flush=true", method: "POST", json: { hook_private_key: testUser.admin_key } }, function (err, res) {
    t.error(err);
    t.equal(res, 1, "flushed logs");
    t.end();
  });
});

tap.test('attempt to delete the hook we just created a new hook - correct access key', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/delete", method: "POST", json: { hook_private_key: testUser.admin_key } }, function (err, res) {
    t.error(err);
    t.equal(res.status, "deleted", "has correct status");
    t.equal(res.owner, "bobby", "has correct owner");
    t.equal(res.name, "test-private-hook", "has correct name");
    t.end();
  });
});