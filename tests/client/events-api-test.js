var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

var testUser = {
  name: "bobby",
  admin_key: "ad255b3e-833e-41e6-bc68-23439ff27f65", // admin-access-key
  run_key: "e27b1183-9375-4b64-ad2f-76a2c8ebd064", // only has hook::run
  read_only: "57a45b7c-7bcd-4c66-a7d4-c847e86764c7" // has only hook::logs::read, events::read
};

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