var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

// Bobby is a pre-generated user 
var testUser = {
  name: "bobby",
  admin_key: "ad255b3e-833e-41e6-bc68-23439ff27f65", // admin-access-key
  run_key: "e27b1183-9375-4b64-ad2f-76a2c8ebd064", // only has hook::run
  read_only: "57a45b7c-7bcd-4c66-a7d4-c847e86764c7" // has only hook::logs::read, events::read
};

tap.test('attempt to create a new public hook - authorized api key', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { 
      name: "test-public-hook", 
      hook_private_key: testUser.admin_key,
      language: "javascript",
      source: 'module["exports"] = function (h) {console.log("logging");h.res.end("ended");}',
      hookSource: "code"
    }}, function (err, res) {
    t.error(err);
    res = res || {};
    t.equal(res.error, undefined, "no errors");
    t.equal(res.type, undefined, "no error type");
    t.equal(res.message, undefined, "no error message");
    t.end();
  });
});

tap.test('attempt to view logs for newly created hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-public-hook/logs", method: "GET", json: true }, function (err, res) {
    t.error(err);
    t.equal(typeof res, "object", "returned json object");
    t.equal(res.length, 0, "found no log entries");
    
    console.log(res)
    //t.equal(res.substr(0, 4), "Logs", 'returned logs')
//    t.equal(res.error, true, "unauthorized role access caused error");
//    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

tap.test('attempt to run the public hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-public-hook", method: "GET" }, function (err, res) {
    t.error(err);
    t.equal(res, 'ended\n', 'returned correct result');
    t.end();
  });
});

tap.test('attempt to view logs for newly created hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-public-hook/logs", method: "GET", json: true }, function (err, res) {
    t.error(err);
    t.equal(typeof res, "object", "returned json object");
    t.equal(res.length, 1, "found one log entry");
    t.end();
  });
});

tap.test('attempt to flush logs for the hook we just created a new hook - correct access key', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-public-hook/logs?flush=true", method: "POST", json: { hook_private_key: testUser.admin_key } }, function (err, res) {
    t.error(err);
    t.equal(res, 1, "flushed logs");
    t.end();
  });
});

tap.test('attempt to delete the hook we just created a new hook - correct access key', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-public-hook/delete", method: "POST", json: { hook_private_key: testUser.admin_key } }, function (err, res) {
    t.error(err);
    t.equal(res.status, "deleted", "has correct status");
    t.equal(res.owner, "bobby", "has correct owner");
    t.equal(res.name, "test-public-hook", "has correct name");
    t.end();
  });
});