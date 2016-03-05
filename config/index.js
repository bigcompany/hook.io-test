module['exports'] = {
  baseUrl: "http://hook.io",
  wsUrl: "hook.io",
  host: 'ondemand.saucelabs.com',
  port: 80,
  user: "Marak",
  key: "dce5a9ba-c8cb-489e-8916-b22a05972fc5",
  testUsers: {
    "bobby": {
      name: "bobby",
      admin_key: "ad255b3e-833e-41e6-bc68-23439ff27f65", // admin-access-key
      run_key: "e27b1183-9375-4b64-ad2f-76a2c8ebd064", // only has hook::run
      read_only: "57a45b7c-7bcd-4c66-a7d4-c847e86764c7" // has only hook::logs::read, events::read
    }
  }
};