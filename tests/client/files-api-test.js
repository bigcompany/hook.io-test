var tap = require("tape");
var r = require('../../lib/helpers/_request');
var config = require('../../config');
var baseURL = config.baseUrl;

var testUser = config.testUsers.bobby;

// TODO: make helper assert method for Vinyl JSON file

var testFile = {
  path:  "hookio-integration-test.txt",
  contents: "hello world"
};

function testAdapter (adapter) {
  tap.test(adapter + ' - attempt to writeFile a file without any auth ( anonymous root )', function (t) {
    r({ uri: baseURL + "/files/writeFile", method: "POST", json: { 
        key: "testKey",
        path: testFile.path,
        adapter: adapter,
        contents: testFile.contents
      }}, function (err, file) {
        t.equal(file.path, testFile.path);
        t.error(err, 'request did not error');
        t.end();
    });
  });

  tap.test(adapter + ' - attempt to readFile the file we just created without any auth ( anonymous root )', function (t) {
    r({ uri: baseURL + "/files/readFile", method: "POST", json: { 
          key: "testKey",
          path: testFile.path,
          adapter: adapter
        } }, function (err, echo) {
          //console.log(err, echo)
          t.error(err, 'request did not error');
          t.equal(echo.contents, "hello world");
          t.end();
    });
  });

  tap.test(adapter + ' - attempt to writeFile a file for bobby with "admin-access-key" role - invalid key', function (t) {
    r({ uri: baseURL + "/files/writeFile", method: "POST", 
        json: {
          hook_private_key: "wrong_key",
          key: "testKey",
          value: "hello",
          path: testFile.path,
          adapter: adapter,
          contents: testFile.contents
         }
       }, function (err, res) {
          console.log('eee', err, res)
          t.error(err, 'request did not error');
          t.equal(res.error, true, "response contains error");
          t.equal(res.type, "unauthorized-role-access", "has correct error type");
          t.end();
    });
  });
  
  // TODO: better format of returned keys
  tap.test(adapter + ' - attempt to writeFile a file for bobby with "file-access-key" role - correct key', function (t) {
    r({ uri: baseURL + "/files/writeFile", method: "POST", 
        json: { 
          hook_private_key: testUser.hook_private_key, 
          path: testFile.path,
          contents: testFile.contents,
          adapter: adapter
        }
      }, function (err, file) {
      t.error(err, 'request did not error');
      t.equal(file.path, testFile.path);
      t.end();
    });
  });

  tap.test(adapter + ' - attempt to readFile a file for bobby with "admin-access-key" role - invalid key', function (t) {
    r({ uri: baseURL + "/files/readFile", method: "POST",
        json: { 
          hook_private_key: "wrong_key",
          path: testFile.path,
          contents: testFile.contents,
          adapter: adapter
        }
      }, function (err, res) {
        t.error(err, 'request did not error');
        t.equal(res.error, true, "response contains error");
        t.equal(res.type, "unauthorized-role-access", "has correct error type");
        t.end();
    });
  });

  tap.test(adapter + ' - attempt to readFile a file for bobby with "admin-access-key" role - correct key', function (t) {
    r({ uri: baseURL + "/files/readFile", method: "POST", 
        json: { 
          hook_private_key: testUser.hook_private_key,
          path: testFile.path,
          adapter: adapter
        }
      }, function (err, file) {
      t.error(err, 'request did not error');
      t.equal(typeof file, "object", "returned file object");
      t.equal(file.contents, "hello world", "returned correct value");
      t.end();
    });
  });

  tap.test(adapter + ' - attempt to readdir for bobby with "admin-access-key" role - correct key', function (t) {
    r({ uri: baseURL + "/files/readdir", method: "GET", 
        json: {
          hook_private_key: testUser.hook_private_key,
          path: "hookio-vfs",
          adapter: adapter
        }
      }, function (err, files) {
        //console.log(err, files)
        t.error(err, 'request did not error');
        t.equal(files instanceof Array, true, "returned array");
        t.equal(files.length > 0, true, "array has items");
        t.end();
    });
  });

  tap.test(adapter + ' - attempt to removeFile a file for for bobby with "admin-access-key" role - invalid key', function (t) {
    r({ uri: baseURL + "/files/removeFile", method: "POST", 
        json: {
          hook_private_key: "wrong_key",
          path: testFile.path,
          adapter: adapter
        }
      }, function (err, res) {
        t.error(err, 'request did not error');
        t.equal(res.error, true, "response contains error");
        t.equal(res.type, "unauthorized-role-access", "has correct error type");
        t.end();
    });
  });

  tap.test(adapter + ' - attempt to removeFile a file for bobby with "admin-access-key" role - correct key', function (t) {
    r({ uri: baseURL + "/files/removeFile", method: "POST",
        json: {
          hook_private_key: testUser.hook_private_key,
          path: testFile.path,
          adapter: adapter
        }
      }, function (err, res) {
        t.error(err, 'request did not error');
        t.equal(res, "removing");
        t.end();
    });
  });

  /*
  tap.test(adapter + ' - attempt to readFile the deleted for bobby with "admin-access-key" role - correct key', function (t) {
    r({ uri: baseURL + "/files/readFile", method: "POST", 
        json: {
          hook_private_key: testUser.hook_private_key,
          path: testFile.path,
          adapter: adapter
        }
      }, function (err, res) {
      t.error(err, 'request did not error');
      t.equal(res, "Not Found", "returned null");
      t.end();
    });
  });
  */

};

testAdapter('microsoft');
return;
testAdapter();
testAdapter('sftp');
testAdapter('amazon');
testAdapter('google');
testAdapter('rackspace');

return;





// TODO: make test to ensure no cross-contamination of files access