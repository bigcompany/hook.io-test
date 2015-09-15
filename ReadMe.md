# Integration Test Suites for hook.io microservice platform

[hook.io](http://hook.io)

## Running the tests

 - Clone this repository
 - `cd` into `hook.io-test` and run `npm install` 
 - Download and Install [Selenium Stand-alone Server](http://docs.seleniumhq.org/download/) 
 - Start Selenium server ( `open`  the `.jar` file on the command line )
 - Run `node tests/basic-test.js`

Note: The basic tests use the `firefox` browser, so you will need to have that installed.

## Gotchas

 - Update to Java and JDK version 8 ( two downloads )
 - You may need to run selenium server or tests with `sudo`



## Goals
  
These tests should be consider Integration Tests, and not Unit Tests for the Hook microservice API.

Unit Tests for all hook.io API related functionality are available in the sub-dependencies which power hook.io itself.
  
These test suites represent a virtual user who browses the site from a headless browser.

These tests provide an overview of product functionality. Their depth of coverage will aim to be as deep as the user can tranverse the live product. The priority of these cases will depend on priority of the user story.




