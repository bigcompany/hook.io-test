var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;


var testUser = {
  name: "bobby",
  hook_private_key: "ad255b3e-833e-41e6-bc68-23439ff27f65", // admin-access-key
  run_key: "e27b1183-9375-4b64-ad2f-76a2c8ebd064", // only has hook::run
  read_only: "57a45b7c-7bcd-4c66-a7d4-c847e86764c7" // has only hook::logs::read, events::read
};

tap.test('attempt to set datastore document without any auth ( anonymous root )', function (t) {
  r({ uri: baseURL + "/datastore/set", method: "POST", json: { key: "testKey", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res, "OK", "was able to set document in anonymous root");
    t.end();
  });
});

tap.test('attempt to get datastore document we just created without any auth ( anonymous root )', function (t) {
  r({ uri: baseURL + "/datastore/get", method: "POST", json: { key: "testKey" } }, function (err, echo) {
    t.error(err, 'request did not error');
    t.equal(echo, "hello");
    t.end();
  });
});

tap.test('attempt to set datastore document for bobby with "admin-access-key" role - invalid key', function (t) {
  r({ uri: baseURL + "/datastore/set", method: "POST", json: { hook_private_key: "wrong_key", key: "testKey", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res.error, true, "response contains error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

// TODO: better format of returned keys
tap.test('attempt to set datastore document for bobby with "admin-access-key" role - correct key', function (t) {
  r({ uri: baseURL + "/datastore/set", method: "POST", json: { hook_private_key: testUser.hook_private_key, key: "another-key", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res, "OK", "returned okay");
    t.end();
  });
});

tap.test('attempt to get datastore document for bobby with "admin-access-key" role - invalid key', function (t) {
  r({ uri: baseURL + "/datastore/get", method: "POST", json: { hook_private_key: "wrong_key", key: "another-key", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res.error, true, "response contains error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

tap.test('attempt to get datastore document for bobby with "admin-access-key" role - correct key', function (t) {
  r({ uri: baseURL + "/datastore/get", method: "POST", json: { hook_private_key: testUser.hook_private_key, key: "another-key", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(typeof res, "string", "returned string");
    t.equal(res, "hello", "returned correct value");
    t.end();
  });
});

tap.test('attempt to get recent datastore entries for bobby with "admin-access-key" role - correct key', function (t) {
  r({ uri: baseURL + "/datastore/recent", method: "GET", json: { hook_private_key: testUser.hook_private_key, key: "another-key", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res instanceof Array, true, "returned array");
    t.equal(res.length > 0, true, "array has items");
    t.end();
  });
});

tap.test('attempt to del datastore document for bobby with "admin-access-key" role - invalid key', function (t) {
  r({ uri: baseURL + "/datastore/del", method: "POST", json: { hook_private_key: "wrong_key", key: "another-key", value: "hello"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res.error, true, "response contains error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

tap.test('attempt to del datastore document for bobby with "admin-access-key" role - correct key', function (t) {
  r({ uri: baseURL + "/datastore/del", method: "POST", json: { hook_private_key: testUser.hook_private_key, key: "another-key" } }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res, 1, "returned 1");
    t.end();
  });
});

tap.test('attempt to get deleted datastore document for bobby with "admin-access-key" role - correct key', function (t) {
  r({ uri: baseURL + "/datastore/get", method: "POST", json: { hook_private_key: testUser.hook_private_key, key: "another-key"} }, function (err, res) {
    t.error(err, 'request did not error');
    t.equal(res, null, "returned null");
    t.end();
  });
});

// TODO: make test to ensure no cross-contamination of datastore access