  
// attempt to signup with with un-available account name

// attempt to signup with available email
  // no password
  // not matching passwords
  // valid matching passwords
  
// attempt to signup with un-available email

// TODO: we need the ability to delete user accounts in order to perform the tear-down for this test

return;
var tap = require("tape");
var r = require('../../lib/helpers/_request');
var baseURL = "http://localhost:9999"


tap.test('attempt to signup with no account name or email', function (t) {
  r({ uri: baseURL + "/signup", method: "POST" }, function (err, res) {
    t.error(err);
    t.equal(res, 'invalid');
    t.end();
  });
});

/*

  attempt to signup by account name

*/

tap.test('attempt to signup by account name with no password', function (t) {
  r({ 
      uri: baseURL + "/signup", 
      method: "POST",
      form: {
        "email": "Bobby"
      },
    }, function (err, res) {
      t.error(err);
      t.equal(res, 'available');
      t.end();
  });
});

tap.test('attempt to signup by account name mismtached passwords', function (t) {
  r({ 
      uri: baseURL + "/signup", 
      method: "POST",
      form: {
        "email": "Bobby",
        "password": "foo",
        "confirmPassword": "fooBar"
      },
    }, function (err, res) {
      t.error(err);
      t.equal(res, 'available');
      t.end();
  });
});

tap.test('attempt to signup by account name with valid password', function (t) {
  r({ 
      uri: baseURL + "/signup", 
      method: "POST",
      form: {
        "email": "Bobby",
        "password": "foo",
        "confirmPassword": "foo"
      },
    }, function (err, res) {
      t.error(err);
      t.equal(res.res, 'valid');
      t.end();
  });
});

tap.test('remove the new user from the database', function (t) {
  
});

return;
// not matching passwords
// valid matching passwords



