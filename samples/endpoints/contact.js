/* Just copy and paste this snippet into your code */
var Promise = require('bluebird');
module.exports = function (req, res, done) {

  var MYOB = Hoist.connector("<key>");
  return Hoist.bucket.set('user').
  then(function () {
    //select all contacts
    return MYOB.get('/contact')
      .then(function (response) {
        //loop through each contact and raise an event
        return Promise.all(
          response.Items.map(function (contact) {
            return Hoist.event.raise('CONTACT:FOUND', contact);
          }));
      }).then(function () {
        done();
      });
  });

};
