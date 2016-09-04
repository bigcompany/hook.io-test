var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

/*

    HOOK PARAMETER TESTS

*/

// TOOD: create echo hook, destroy and cleanup echo hook

tap.test('get the echo hook', function (t) {
  r({ uri: baseURL + "/marak/echo" }, function (err, echo) {
    t.error(err, 'did not error');
    console.log(err, echo)
    t.equal(typeof echo, 'object', 'returned object response')
    t.end();
  });
});

tap.test('get the echo hook with query string parameters', function (t) {
  r({ uri: baseURL + "/marak/echo?baz=boz" }, function (err, echo) {
    t.error(err, 'did not error');
    t.equal(echo.baz, "boz", "echo'd back arbitrary query parameter");
    t.end();
  });
});

tap.test('post to the echo hook', function (t) {
  r({ uri: baseURL + "/marak/echo", method: "post" }, function (err, echo) {
    t.error(err, 'did not error');
    t.end();
  });
});

/*

    JSON TESTS

*/

tap.test('post to the echo hook with JSON data', function (t) {
  r({ 
    uri: baseURL + "/marak/echo", 
    method: "post",
    json: {
      "baz": "boz"
    }
  }, function (err, echo) {
    t.error(err, 'did not error');
    t.equal(echo.baz, "boz", "echo'd back arbitrary json parameter");
    t.end();
  });
});

/*

    FORM SUBMIT TESTS

*/

tap.test('submit a URL-encoded form to the echo hook with form data', function (t) {
  r({ 
    uri: baseURL + "/marak/echo", 
    method: "post",
    form: {
      "baz": "boz"
    }
  }, function (err, echo) {
    t.error(err, 'did not error');
    t.equal(echo.baz, "boz", "echo'd back arbitrary form parameter");
    t.end();
  });
});

/*

    SCHEMA TESTS

*/

tap.test('get the echo hook and check default schema data', function (t) {
  r({ uri: baseURL + "/marak/echo" }, function (err, echo) {
    t.error(err, 'did not error');
    t.equal(echo.param1, "foo", "echo'd back default schema value for arbitrary parameter");
    t.equal(echo.param2, "bar", "echo'd back default schema value for arbitrary parameter");
    t.end();
  });
});

tap.test('post the echo hook and check default schema data', function (t) {
  r({ uri: baseURL + "/marak/echo", method: "post" }, function (err, echo) {
    t.error(err);
    t.equal(echo.param1, "foo");
    t.equal(echo.param2, "bar");
    t.end();
  });
});