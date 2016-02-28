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

var freeUser = {
  name: "bobby-free"
};

tap.test('attempt to create a new hook without any auth ( anonymous root )', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { 
      name: "test-hook"
    } }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.equal(res.role, "hook::create", "has correct role type");
    t.end();
  });
});

tap.test('attempt to create a new hook with missing name - authorized api key', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { hook_private_key: testUser.admin_key } }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res.error, true, "response contains error");
    t.equal(res.property, "name", "error with name property");
    t.equal(res.required, true, "is required");
    t.end();
  });
});

/*
// TODO: more test users / better test user creation / teardown
tap.test('attempt to create a new private hook - authorized api key - free account', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { 
      name: "test-private-hook", 
      hook_private_key: testUser.admin_key,
      isPrivate: true,
      language: "ruby",
      source: 'puts "hello"',
      hookSource: "code"
    }}, function (err, res) {
    t.error(err);
    t.equal(res.error, true, "return error");
    t.equal(res.type, "paid-account-required", "no error type");
    t.equal(typeof res.message, "string", "return string error message");
    t.end();
  });
});
*/

tap.test('attempt to create a new private hook - authorized api key - paid account', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { 
      name: "test-private-hook", 
      hook_private_key: testUser.admin_key,
      isPrivate: true,
      language: "ruby",
      source: 'puts "hello"',
      hookSource: "code"
    }}, function (err, res) {
    t.error(err);
    t.equal(typeof res, "object");
    t.equal(res.status, "created");
    t.end();
  });
});

tap.test('attempt to run the private hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "GET" }, function (err, res) {
    t.error(err);
    res = res || {};
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

tap.test('attempt to run the private hook - admin access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "POST", json: { hook_private_key: testUser.admin_key }}, function (err, res) {
    t.error(err);
    t.equal(res, "hello\n", "hook ran");
    t.end();
  });
});

tap.test('attempt to run the private hook - run-only access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "POST", json: { hook_private_key: testUser.run_key }}, function (err, res) {
    t.error(err);
    t.equal(res, "hello\n", "hook ran");
    t.end();
  });
});

tap.test('attempt to run the private hook - run access - http header key', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "GET", headers: { "hookio-private-key": testUser.run_key } }, function (err, res) {
    t.error(err);
    t.equal(res, 'hello\n', 'returned correct result');
    t.end();
  });
});

tap.test('attempt to run the private hook - read-only access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "POST", json: { hook_private_key: testUser.read_only }}, function (err, res) {
    t.error(err);
    res = res || {};
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
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

tap.test('attempt to delete the hook we just created a new hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/delete", method: "GET", json: true }, function (err, res) {
    t.error(err);
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.equal(res.role, "hook::destroy", "has correct role type");
    t.equal(res.user, "anonymous", "has correct session");
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