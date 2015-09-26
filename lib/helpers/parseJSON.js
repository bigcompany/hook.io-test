module['exports'] = function parseJSON (str) {
  var json, e;
  try {
     json = JSON.parse(str);
   } catch (err) {
     e = err;
     e.message = 'Cannot parse as JSON string: ' + str;
   }
   if (e) {
     throw e;
   }
   return json;
};