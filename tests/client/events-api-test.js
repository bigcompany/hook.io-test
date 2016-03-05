var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

var testUser = config.testUsers.bobby;

tap.test('attempt to view system events for bobby - anonymous access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/events", method: "GET", json: true }, function (err, res) {
    t.error(err);
    t.equal(typeof res, "object", "returned json object");
    t.equal(res.error, true, "unauthorized role access caused error");
    t.equal(res.type, "unauthorized-role-access", "has correct error type");
    t.end();
  });
});

tap.test('attempt to view logs for newly created hook - read only access', function (t) {
  r({ uri: baseURL + "/" + testUser.name + "/events", method: "POST", json: { hook_private_key: testUser.read_only } }, function (err, res) {
    t.error(err);
    t.equal(typeof res, "object", "returned json object");
    t.equal(res.length > 0, true, "found array of events");
    t.end();
  });
});