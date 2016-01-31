var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

var testUser = {
  name: "Bobby",
  hook_private_key: "e8c0ac94-f914-454e-b316-291b802584bf"
};

tap.test('attempt to create a new hook without any auth ( anonymous root )', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { name: "test-hook" } }, function (err, res) {
    t.error(err);
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.equal(res.role, "hook::create", "has correct role type");
    t.end();
  });
});

tap.test('attempt to create a new hook with missing name - authorized api key', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { hook_private_key: testUser.hook_private_key } }, function (err, res) {
    t.error(err);
    t.equal(res.error, true, "did error");
    t.equal(res.property, "name", "error with name property");
    t.equal(res.required, true, "is required");
    t.end();
  });
});

tap.test('attempt to create a new private hook - authorized api key', function (t) {
  r({ uri: baseURL + "/new", method: "POST", json: { 
      name: "test-private-hook", 
      hook_private_key: testUser.hook_private_key,
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

tap.test('attempt to run the private hook - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook", method: "GET" }, function (err, res) {
    t.error(err);
    res = res || {};
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
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
  r({ uri: baseURL + "/" + testUser.name + "/" + "test-private-hook/delete", method: "POST", json: { hook_private_key: testUser.hook_private_key } }, function (err, res) {
    t.error(err);
    t.equal(res.status, "deleted", "has correct status");
    t.equal(res.owner, "bobby", "has correct owner");
    t.equal(res.name, "test-private-hook", "has correct name");
    t.end();
  });
});