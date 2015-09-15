var wd = require('wd')
  , assert = require('assert')
  , server
  , browser = wd.remote();

/*
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});
*/

var tap = require("tape");


tap.test('start the webdriver client', function (t) {

  browser.init({
      browserName: 'firefox'
      , tags : ["examples"]
      , name: "This is an example test"
    }, function(err) {
    if(err) {
      throw err;
    }
    t.ok(true, 'browser started');
    t.end();
  });

});

var baseUrl = "http://hook.io/";

tap.test("get home page, check title", function (t) {

  browser.get(baseUrl, function (err, result) {
    if(err) {
      throw err
    }
    browser.title(function(err, title) {
      t.equal(title.substr(0, 7), 'hook.io', 'title exists as string');
      t.end();
    });
  });

});